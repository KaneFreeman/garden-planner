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
  type?: PlantType;
  url?: string;
  daysToMaturity?: [number | undefined, number | undefined];
  pictures?: PictureData[];
  comments?: Comment[];
}

export interface PlantDTO {
  _id: string;
  name: string;
  type?: PlantType;
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

export interface ContainerSlotIdentifier {
  containerId: string;
  slotId: number;
}
export interface Slot {
  plant?: string;
  status?: Status;
  plantedCount?: number;
  plantedDate?: Date;
  transplantedDate?: Date;
  transplantedTo: ContainerSlotIdentifier | null;
  transplantedFrom: ContainerSlotIdentifier | null;
  comments?: Comment[];
  pictures?: PictureData[];
}

export interface SlotDTO {
  plant?: string;
  status?: Status;
  plantedCount?: number;
  plantedDate?: string;
  transplantedDate?: string;
  transplantedTo: ContainerSlotIdentifier | null;
  transplantedFrom: ContainerSlotIdentifier | null;
  comments?: CommentDTO[];
  pictures?: PictureDataDTO[];
}

export function fromSlotDTO(dto: SlotDTO): Slot {
  return {
    ...dto,
    plantedDate: dto.plantedDate ? new Date(dto.plantedDate) : undefined,
    transplantedDate: dto.transplantedDate ? new Date(dto.transplantedDate) : undefined,
    pictures: dto.pictures !== undefined ? dto.pictures.map(fromPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(fromCommentDTO) : undefined
  };
}

export function toSlotDTO(dto: Slot): SlotDTO {
  return {
    ...dto,
    plantedDate: dto.plantedDate ? dto.plantedDate.toISOString() : undefined,
    transplantedDate: dto.transplantedDate ? dto.transplantedDate.toISOString() : undefined,
    pictures: dto.pictures !== undefined ? dto.pictures.map(toPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(toCommentDTO) : undefined
  };
}

export interface Container {
  _id: string;
  name: string;
  rows: number;
  columns: number;
  slots?: Record<number, Slot>;
}

export interface ContainerDTO {
  _id: string;
  name: string;
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
export const CUSTOM = 'Custom';
export type TaskType = typeof PLANT | typeof TRANSPLANT | typeof CUSTOM;
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

export interface TaskDTO {
  _id: string;
  text: string;
  type: TaskType;
  start: string;
  due: string;
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

export interface PlantDataDTO {
  howToGrow: {
    spring?: {
      indoor?: {
        min: string;
        max: string;
        transplant_min: string;
        transplant_max: string;
      };
      plant?: {
        min: string;
        max: string;
      };
      outdoor?: {
        min: string;
        max: string;
      };
    };
    fall?: {
      indoor?: {
        min: string;
        max: string;
        transplant_min: string;
        transplant_max: string;
      };
      plant?: {
        min: string;
        max: string;
      };
      outdoor?: {
        min: string;
        max: string;
      };
    };
  };
  faq: {
    how_to_grow?: [string, string][];
  };
}
