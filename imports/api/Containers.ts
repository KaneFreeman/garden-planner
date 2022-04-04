import parse from 'date-fns/parse';
import { Mongo } from 'meteor/mongo';
import plantData from '../data/plantData';
import { PlantData } from '../ui/interface';
import getSlotTitle from '../ui/utility/slot.util';
import { PictureData, Comment } from './Common';
import { Plant, PlantsCollection } from './Plants';
import { TasksCollection } from './Tasks';

export const NOT_PLANTED = 'Not Planted';
export const PLANTED = 'Planted';
export const TRANSPLANTED = 'Transplanted';
export type Status = typeof NOT_PLANTED | typeof PLANTED | typeof TRANSPLANTED;
export const STATUSES: Status[] = [NOT_PLANTED, PLANTED, TRANSPLANTED];

export interface Slot {
  plant?: string;
  status?: Status;
  plantedCount?: number;
  plantedDate?: Date;
  transplantedDate?: Date;
  comments?: Comment[];
  pictures?: PictureData[];
}

export interface Container {
  _id: string;
  name: string;
  rows: number;
  columns: number;
  slots?: Record<number, Slot>;
}

function parseDate(date: string) {
  return parse(date, 'MMM d', new Date());
}

function getPlantedStartAndDueDate(data: PlantData): { start: Date; due: Date } | undefined {
  if (data.howToGrow.indoor?.indoor_min && data.howToGrow.indoor?.indoor_max) {
    return { start: parseDate(data.howToGrow.indoor.indoor_min), due: parseDate(data.howToGrow.indoor.indoor_max) };
  }

  if (data.howToGrow.outdoor?.direct_min && data.howToGrow.outdoor.direct_max) {
    return { start: parseDate(data.howToGrow.outdoor.direct_min), due: parseDate(data.howToGrow.outdoor.direct_max) };
  }

  return undefined;
}

function getTransplantedStartAndDueDate(data: PlantData): { start: Date; due: Date } | undefined {
  if (data.howToGrow.indoor?.transplant_min && data.howToGrow.indoor?.transplant_max) {
    return {
      start: parseDate(data.howToGrow.indoor.transplant_min),
      due: parseDate(data.howToGrow.indoor.transplant_max)
    };
  }

  return undefined;
}

function createUpdatePlantedTask(
  container: Container,
  slot: Slot,
  plant: Plant,
  data: PlantData,
  path: string,
  slotTitle: string
) {
  const dates = getPlantedStartAndDueDate(data);
  if (!dates) {
    return;
  }

  const { start, due } = dates;

  const task = TasksCollection.findOne({ type: 'Plant', path });
  const completedOn = slot.status && slot.status !== 'Not Planted' ? slot.plantedDate ?? null : null;

  if (!task) {
    TasksCollection.insert({
      text: `Plant ${plant.name} in ${container.name} at ${slotTitle}`,
      type: 'Plant',
      start,
      due,
      path,
      completedOn
    });
  } else {
    TasksCollection.update(task._id, {
      $set: {
        text: `Plant ${plant.name} in ${container.name} at ${slotTitle}`,
        start,
        due,
        completedOn
      }
    });
  }
}

function createUpdateTransplantedTask(
  container: Container,
  slot: Slot,
  plant: Plant,
  data: PlantData,
  path: string,
  slotTitle: string
) {
  const dates = getTransplantedStartAndDueDate(data);
  if (!dates) {
    return;
  }

  const { start, due } = dates;

  const task = TasksCollection.findOne({ type: 'Transplant', path });
  const completedOn = slot.status === 'Transplanted' ? slot.plantedDate ?? null : null;

  if (!task) {
    TasksCollection.insert({
      text: `Transplant ${plant.name} from ${container.name} at ${slotTitle}`,
      type: 'Transplant',
      start,
      due,
      path,
      completedOn
    });
  } else {
    TasksCollection.update(task._id, {
      $set: {
        text: `Transplant ${plant.name} from ${container.name} at ${slotTitle}`,
        start,
        due,
        completedOn
      }
    });
  }
}

function createUpdatePlantTasks(container: Container | undefined) {
  if (!container?.slots) {
    return;
  }

  const { slots } = container;

  Object.keys(slots).forEach((slotIndex) => {
    const slot = slots[+slotIndex];
    if (!slot?.plant) {
      return;
    }

    const plant = PlantsCollection.findOne(slot.plant);
    if (!plant?.type) {
      return;
    }

    const data = plantData[plant.type];
    if (!data) {
      return;
    }

    const path = `/container/${container._id}/slot/${slotIndex}`;
    const slotTitle = getSlotTitle(+slotIndex, container.rows);

    createUpdatePlantedTask(container, slot, plant, data, path, slotTitle);
    createUpdateTransplantedTask(container, slot, plant, data, path, slotTitle);
  });
}

class ContainersCollectionBase extends Mongo.Collection<Container> {
  insert: Mongo.Collection<Container>['insert'] = (doc, callback) => {
    const newId = super.insert(doc, callback);
    const container = this.findOne(newId);
    createUpdatePlantTasks(container);
    return newId;
  };

  update: Mongo.Collection<Container>['update'] = (selector, modifier, options, callback) => {
    const updateCount = super.update(selector, modifier, options, callback);
    const container = this.findOne(selector);
    createUpdatePlantTasks(container);
    return updateCount;
  };
}

export const ContainersCollection = new ContainersCollectionBase('containers');
