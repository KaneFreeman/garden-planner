import mapRecord from './utility/record.util';

export interface PictureData {
  date: Date;
  id: number;
  pictureId: string;
  thumbnail: string;
  deleted?: boolean;
}

export interface PictureDataDTO {
  date: string;
  id: number;
  pictureId: string;
  thumbnail: string;
  deleted?: boolean;
}

export function fromPictureDataDTO(dto: PictureDataDTO): PictureData {
  return {
    ...dto,
    date: new Date(dto.date)
  };
}

export function toPictureDataDTO(dto: Omit<PictureData, '_id'>): Omit<PictureDataDTO, '_id'> {
  return {
    ...dto,
    date: dto.date.toISOString()
  };
}

export interface Comment {
  date: Date;
  text: string;
}

export interface CommentDTO {
  date: string;
  text: string;
}

export function fromCommentDTO(dto: CommentDTO): Comment {
  return {
    ...dto,
    date: new Date(dto.date)
  };
}

export function toCommentDTO(dto: Omit<Comment, '_id'>): Omit<CommentDTO, '_id'> {
  return {
    ...dto,
    date: dto.date.toISOString()
  };
}

export const ARTICHOKE = 'Artichoke';
export const ARUGULA = 'Arugula';
export const ASPARAGUS = 'Asparagus';
export const BEAN = 'Bean';
export const BEET = 'Beet';
export const BROCCOLI = 'Broccoli';
export const BROCCOLI_RAAB = 'Broccoli Raab';
export const BROKALI = 'Brokali';
export const BRUSSELS_SPROUT = 'Brussels Sprout';
export const CABBAGE = 'Cabbage';
export const CANTALOUPE = 'Cantaloupe';
export const CARROT = 'Carrot';
export const CAULIFLOWER = 'Cauliflower';
export const CELERY = 'Celery';
export const CHINESE_CABBAGE = 'Chinese Cabbage';
export const COLLARD = 'Collard';
export const CORN = 'Corn';
export const CORN_SALAD = 'Corn Salad';
export const COWPEA = 'Cowpea';
export const CUCUMBER = 'Cucumber';
export const EGGPLANT = 'Eggplant';
export const ENDIVE = 'Endive';
export const GARLIC = 'Garlic';
export const GOURD = 'Gourd';
export const HORSERADISH = 'Horseradish';
export const KALE = 'Kale';
export const KOHLRABI = 'Kohlrabi';
export const LEEK = 'Leek';
export const LETTUCE = 'Lettuce';
export const MELON = 'Melon';
export const MESCLUN = 'Mesclun';
export const MUSTARD = 'Mustard';
export const OKRA = 'Okra';
export const ONION = 'Onion';
export const PARSNIP = 'Parsnip';
export const PEANUT = 'Peanut';
export const PEA = 'Pea';
export const PEPPER = 'Pepper';
export const POTATOE = 'Potatoe';
export const PUMPKIN = 'Pumpkin';
export const RADICCHIO = 'Radicchio';
export const RADISH = 'Radish';
export const RHUBARB = 'Rhubarb';
export const RUTABAGA = 'Rutabaga';
export const SHALLOT = 'Shallot';
export const SPINACH = 'Spinach';
export const SQUASH = 'Squash';
export const SWEET_POTATOE = 'Sweet Potatoe';
export const SWISS_CHARD = 'Swiss Chard';
export const TOMATILLO = 'Tomatillo';
export const TOMATO = 'Tomato';
export const TURNIP = 'Turnip';
export const WATERMELON = 'Watermelon';

export const BASIL = 'Basil';
export const BORAGE = 'Borage';
export const CAT_GRASS = 'Cat Grass';
export const CATNIP = 'Catnip';
export const CHAMOMILE = 'Chamomile';
export const CHERVIL = 'Chervil';
export const CHIVE = 'Chive';
export const CILANTRO = 'Cilantro';
export const DILL = 'Dill';
export const FENNEL = 'Fennel';
export const LAVENDER = 'Lavender';
export const LEMON_BALM = 'Lemon Balm';
export const LEMON_GRASS = 'Lemon Grass';
export const MARJORAM = 'Marjoram';
export const MINT = 'Mint';
export const OREGANO = 'Oregano';
export const THYME = 'Thyme';
export const PARSLEY = 'Parsley';
export const ROSEMARY = 'Rosemary';
export const SAGE = 'Sage';
export const STEVIA = 'Stevia';
export const SWEET_MARIGOLD = 'Sweet Marigold';
export const VERBENA = 'Verbena';

export const MARIGOLD = 'Marigold';
export const COSMOS = 'Cosmos';
export const SUNFLOWER = 'Sunflower';

export type PlantType =
  | typeof ARTICHOKE
  | typeof ARUGULA
  | typeof ASPARAGUS
  | typeof BEAN
  | typeof BEET
  | typeof BROCCOLI
  | typeof BROCCOLI_RAAB
  | typeof BROKALI
  | typeof BRUSSELS_SPROUT
  | typeof CABBAGE
  | typeof CANTALOUPE
  | typeof CARROT
  | typeof CAULIFLOWER
  | typeof CELERY
  | typeof CHINESE_CABBAGE
  | typeof COLLARD
  | typeof CORN
  | typeof CORN_SALAD
  | typeof COWPEA
  | typeof CUCUMBER
  | typeof EGGPLANT
  | typeof ENDIVE
  | typeof GARLIC
  | typeof GOURD
  | typeof HORSERADISH
  | typeof KALE
  | typeof KOHLRABI
  | typeof LEEK
  | typeof LETTUCE
  | typeof MELON
  | typeof MESCLUN
  | typeof MUSTARD
  | typeof OKRA
  | typeof ONION
  | typeof PARSNIP
  | typeof PEANUT
  | typeof PEA
  | typeof PEPPER
  | typeof POTATOE
  | typeof PUMPKIN
  | typeof RADICCHIO
  | typeof RADISH
  | typeof RHUBARB
  | typeof RUTABAGA
  | typeof SHALLOT
  | typeof SPINACH
  | typeof SQUASH
  | typeof SWEET_POTATOE
  | typeof SWISS_CHARD
  | typeof TOMATILLO
  | typeof TOMATO
  | typeof TURNIP
  | typeof WATERMELON
  | typeof BASIL
  | typeof BORAGE
  | typeof CAT_GRASS
  | typeof CATNIP
  | typeof CHAMOMILE
  | typeof CHERVIL
  | typeof CHIVE
  | typeof CILANTRO
  | typeof DILL
  | typeof FENNEL
  | typeof LAVENDER
  | typeof LEMON_BALM
  | typeof LEMON_GRASS
  | typeof MARJORAM
  | typeof MINT
  | typeof OREGANO
  | typeof THYME
  | typeof PARSLEY
  | typeof ROSEMARY
  | typeof SAGE
  | typeof STEVIA
  | typeof SWEET_MARIGOLD
  | typeof VERBENA
  | typeof MARIGOLD
  | typeof COSMOS
  | typeof SUNFLOWER;

export const PLANT_TYPES: PlantType[] = [
  ARTICHOKE,
  ARUGULA,
  ASPARAGUS,
  BEAN,
  BEET,
  BROCCOLI,
  BROCCOLI_RAAB,
  BROKALI,
  BRUSSELS_SPROUT,
  CABBAGE,
  CANTALOUPE,
  CARROT,
  CAULIFLOWER,
  CELERY,
  CHINESE_CABBAGE,
  COLLARD,
  CORN,
  CORN_SALAD,
  COWPEA,
  CUCUMBER,
  EGGPLANT,
  ENDIVE,
  GARLIC,
  GOURD,
  HORSERADISH,
  KALE,
  KOHLRABI,
  LEEK,
  LETTUCE,
  MELON,
  MESCLUN,
  MUSTARD,
  OKRA,
  ONION,
  PARSNIP,
  PEANUT,
  PEA,
  PEPPER,
  POTATOE,
  PUMPKIN,
  RADICCHIO,
  RADISH,
  RHUBARB,
  RUTABAGA,
  SHALLOT,
  SPINACH,
  SQUASH,
  SWEET_POTATOE,
  SWISS_CHARD,
  TOMATILLO,
  TOMATO,
  TURNIP,
  WATERMELON,
  BASIL,
  BORAGE,
  CAT_GRASS,
  CATNIP,
  CHAMOMILE,
  CHERVIL,
  CHIVE,
  CILANTRO,
  DILL,
  FENNEL,
  LAVENDER,
  LEMON_BALM,
  LEMON_GRASS,
  MARJORAM,
  MINT,
  OREGANO,
  THYME,
  PARSLEY,
  ROSEMARY,
  SAGE,
  STEVIA,
  SWEET_MARIGOLD,
  VERBENA,
  MARIGOLD,
  COSMOS,
  SUNFLOWER
];

export interface Plant {
  _id: string;
  name: string;
  type?: PlantType | null;
  url?: string;
  daysToMaturity?: [number | undefined, number | undefined];
  pictures?: PictureData[];
  comments?: Comment[];
}

export interface PlantDTO {
  _id: string;
  name: string;
  type?: PlantType | null;
  url?: string;
  daysToMaturity?: [number | undefined, number | undefined];
  pictures?: PictureDataDTO[];
  comments?: CommentDTO[];
}

export function fromPlantDTO(dto: PlantDTO): Plant {
  return {
    ...dto,
    pictures: dto.pictures !== undefined ? dto.pictures.map(fromPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(fromCommentDTO) : undefined
  };
}

export function toPlantDTO(dto: Omit<Plant, '_id'>): Omit<PlantDTO, '_id'> {
  return {
    ...dto,
    pictures: dto.pictures !== undefined ? dto.pictures.map(toPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(toCommentDTO) : undefined
  };
}

export const NOT_PLANTED = 'Not Planted';
export const PLANTED = 'Planted';
export const TRANSPLANTED = 'Transplanted';
export type Status = typeof NOT_PLANTED | typeof PLANTED | typeof TRANSPLANTED;
export const STATUSES: Status[] = [NOT_PLANTED, PLANTED, TRANSPLANTED];

export interface ContainerFertilizeDTO {
  readonly date: string;
}

export interface ContainerSlotIdentifier {
  containerId: string;
  slotId: number;
  subSlot?: boolean;
}

export interface BaseSlot {
  plant?: string | null;
  status?: Status;
  plantedCount?: number;
  plantedDate?: Date;
  transplantedDate?: Date;
  transplantedTo: ContainerSlotIdentifier | null;
  transplantedFromDate?: Date;
  transplantedFrom: ContainerSlotIdentifier | null;
  firstHarvestDate?: Date;
  startedFrom: StartedFromType;
  comments?: Comment[];
  pictures?: PictureData[];
}

export interface Slot extends BaseSlot {
  subSlot?: BaseSlot;
}

export type BaseSlotWithIdentifier = BaseSlot & ContainerSlotIdentifier;

export interface BaseSlotDTO {
  plant?: string | null;
  status?: Status;
  plantedCount?: number;
  plantedDate?: string;
  transplantedDate?: string;
  transplantedTo: ContainerSlotIdentifier | null;
  transplantedFromDate?: string;
  transplantedFrom: ContainerSlotIdentifier | null;
  firstHarvestDate?: string;
  startedFrom: StartedFromType;
  comments?: CommentDTO[];
  pictures?: PictureDataDTO[];
}

export interface SlotDTO extends BaseSlotDTO {
  subSlot?: BaseSlotDTO;
}

function fromBaseSlotDTO(dto: BaseSlotDTO): BaseSlot {
  return {
    ...dto,
    plantedDate: dto.plantedDate ? new Date(dto.plantedDate) : undefined,
    transplantedDate: dto.transplantedDate ? new Date(dto.transplantedDate) : undefined,
    transplantedFromDate: dto.transplantedFromDate ? new Date(dto.transplantedFromDate) : undefined,
    firstHarvestDate: dto.firstHarvestDate ? new Date(dto.firstHarvestDate) : undefined,
    pictures: dto.pictures !== undefined ? dto.pictures.map(fromPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(fromCommentDTO) : undefined
  };
}

export function fromSlotDTO(dto: SlotDTO): Slot {
  return {
    ...fromBaseSlotDTO(dto),
    subSlot: dto.subSlot ? fromBaseSlotDTO(dto.subSlot) : undefined
  };
}

export function toBaseSlotDTO(dto: BaseSlot): BaseSlotDTO {
  return {
    ...dto,
    plantedDate: dto.plantedDate ? dto.plantedDate.toISOString() : undefined,
    transplantedDate: dto.transplantedDate ? dto.transplantedDate.toISOString() : undefined,
    transplantedFromDate: dto.transplantedFromDate ? dto.transplantedFromDate.toISOString() : undefined,
    firstHarvestDate: dto.firstHarvestDate ? dto.firstHarvestDate.toISOString() : undefined,
    pictures: dto.pictures !== undefined ? dto.pictures.map(toPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(toCommentDTO) : undefined
  };
}

export function toSlotDTO(dto: Slot): SlotDTO {
  return {
    ...toBaseSlotDTO(dto),
    subSlot: dto.subSlot ? toBaseSlotDTO(dto.subSlot) : undefined
  };
}

export const STARTED_FROM_TYPE_SEED = 'Seed';
export const STARTED_FROM_TYPE_TRANSPLANT = 'Transplant';
export type StartedFromType = typeof STARTED_FROM_TYPE_SEED | typeof STARTED_FROM_TYPE_TRANSPLANT;
export const STARTED_FROM_TYPES: StartedFromType[] = [STARTED_FROM_TYPE_SEED, STARTED_FROM_TYPE_TRANSPLANT];

export const CONTAINER_TYPE_INSIDE = 'Inside';
export const CONTAINER_TYPE_OUTSIDE = 'Outside';
export type ContainerType = typeof CONTAINER_TYPE_INSIDE | typeof CONTAINER_TYPE_OUTSIDE;
export const CONTAINER_TYPES: ContainerType[] = [CONTAINER_TYPE_INSIDE, CONTAINER_TYPE_OUTSIDE];

export interface Container {
  _id: string;
  name: string;
  type: ContainerType;
  rows: number;
  columns: number;
  slots?: Record<number, Slot>;
  startedFrom?: StartedFromType;
  archived?: boolean;
}

export interface ContainerDTO {
  _id: string;
  name: string;
  type: ContainerType;
  rows: number;
  columns: number;
  slots?: Record<number, SlotDTO>;
}

export function fromContainerDTO(dto: ContainerDTO): Container {
  return {
    ...dto,
    slots: dto.slots ? mapRecord(dto.slots, fromSlotDTO) : undefined
  };
}

export function toContainerDTO(dto: Omit<Container, '_id'>): Omit<ContainerDTO, '_id'> {
  return {
    ...dto,
    slots: dto.slots ? mapRecord(dto.slots, toSlotDTO) : undefined
  };
}

export interface Picture {
  _id: string;
  dataUrl: string;
}

export interface PictureDTO {
  _id: string;
  dataUrl: string;
}

export function fromPictureDTO(dto: PictureDTO): Picture {
  return {
    ...dto
  };
}

export function toPictureDTO(dto: Omit<Picture, '_id'>): Omit<PictureDTO, '_id'> {
  return {
    ...dto
  };
}

export const PLANT = 'Plant';
export const TRANSPLANT = 'Transplant';
export const FERTILIZE = 'Fertilize';
export const CUSTOM = 'Custom';
export type TaskType = typeof PLANT | typeof TRANSPLANT | typeof FERTILIZE | typeof CUSTOM;
export const TASK_TYPES: TaskType[] = [PLANT, TRANSPLANT, FERTILIZE, CUSTOM];

export interface Task {
  _id: string;
  text: string;
  type: TaskType;
  start: Date;
  due: Date;
  containerId: string | null;
  path: string | null;
  completedOn: Date | null;
}

export interface TaskDTO {
  _id: string;
  text: string;
  type: TaskType;
  start: string;
  due: string;
  containerId: string | null;
  path: string | null;
  completedOn: string | null;
}

export function fromTaskDTO(dto: TaskDTO): Task {
  return {
    ...dto,
    start: new Date(dto.start),
    due: new Date(dto.due),
    completedOn: dto.completedOn !== null ? new Date(dto.completedOn) : null
  };
}

export function toTaskDTO(dto: Omit<Task, '_id'>): Omit<TaskDTO, '_id'> {
  return {
    ...dto,
    start: dto.start.toISOString(),
    due: dto.due.toISOString(),
    completedOn: dto.completedOn !== null ? dto.completedOn.toISOString() : null
  };
}

export interface FertilizerApplication {
  start: number;
  end?: number;
  from: 'Planted' | 'Transplanted';
  description?: string;
}

export interface GrowDates {
  indoor?: {
    min: number;
    max: number;
    transplant_min: number;
    transplant_max: number;
    fertilize?: FertilizerApplication[];
  };
  plant?: {
    min: number;
    max: number;
  };
  outdoor?: {
    min: number;
    max: number;
  };
  fertilize?: FertilizerApplication[];
}

export interface PlantDataDTO {
  howToGrow: {
    spring?: GrowDates;
    fall?: GrowDates;
  };
  faq: {
    how_to_grow?: [string, string][];
  };
}

export interface SortedTasks {
  tasks: Task[];
  completed: Task[];
  overdue: Task[];
  next: Task[];
  thisWeek: Task[];
  active: Task[];
}
