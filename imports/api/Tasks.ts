import { Mongo } from 'meteor/mongo';

export const PLANT = 'Plant';
export const TRANSPLANT = 'Transplant';
export const CUSTOM = 'Custom';
export type TaskType = typeof PLANT | typeof TRANSPLANT | typeof CUSTOM
export const TASK_TYPES: TaskType[] = [PLANT, TRANSPLANT, CUSTOM];

export interface Task {
  _id: string;
  text: string;
  type: TaskType;
  start: Date;
  due: Date;
  path: string | null;
  completedOn: Date | null;
}

export const TasksCollection = new Mongo.Collection<Task>('tasks');
