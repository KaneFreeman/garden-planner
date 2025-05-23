import { mapRecord } from './utility/record.util';

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

export function toPictureDataDTO(dto: PictureData): PictureDataDTO {
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
export const SAVORY = 'Savory';
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
  | typeof SAVORY
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
  SAVORY,
  STEVIA,
  SWEET_MARIGOLD,
  VERBENA,
  MARIGOLD,
  COSMOS,
  SUNFLOWER
];

export const MATURITY_FROM_SEED = 'Seed';
export const MATURITY_FROM_TRANSPLANT = 'Transplant';
export type MaturityFromType = typeof MATURITY_FROM_SEED | typeof MATURITY_FROM_TRANSPLANT;
export const MATURITY_FROM_TYPES: MaturityFromType[] = [MATURITY_FROM_SEED, MATURITY_FROM_TRANSPLANT];

export interface Plant {
  _id: string;
  name: string;
  type?: PlantType | null;
  url?: string;
  daysToGerminate?: [number | undefined, number | undefined];
  daysToMaturity?: [number | undefined, number | undefined];
  maturityFrom?: MaturityFromType | null;
  pictures?: PictureData[];
  comments?: Comment[];
  retired?: boolean;
  reorder?: boolean;
  lastOrdered?: Date;
}

export interface PlantDTO {
  _id: string;
  name: string;
  type?: PlantType | null;
  url?: string;
  daysToGerminate?: [number | undefined, number | undefined];
  daysToMaturity?: [number | undefined, number | undefined];
  maturityFrom?: MaturityFromType | null;
  pictures?: PictureDataDTO[];
  comments?: CommentDTO[];
  retired?: boolean;
  lastOrdered?: string;
}

export function fromPlantDTO(dto: PlantDTO): Plant {
  return {
    ...dto,
    pictures: dto.pictures !== undefined ? dto.pictures.map(fromPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(fromCommentDTO) : undefined,
    lastOrdered: dto.lastOrdered ? new Date(dto.lastOrdered) : undefined
  };
}

export function toPlantDTO(dto: Plant): PlantDTO;
export function toPlantDTO(dto: Omit<Plant, '_id'>): Omit<PlantDTO, '_id'>;
export function toPlantDTO(dto: Omit<Plant, '_id'> | Plant): Omit<PlantDTO, '_id'> | PlantDTO {
  return {
    ...dto,
    pictures: dto.pictures !== undefined ? dto.pictures.map(toPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(toCommentDTO) : undefined,
    lastOrdered: dto.lastOrdered ? dto.lastOrdered.toISOString() : undefined
  };
}

export const PLANTED = 'Planted';
export const TRANSPLANTED = 'Transplanted';
export const HARVESTED = 'Harvested';
export const FERTILIZED = 'Fertilized';
export type HistoryStatus = typeof PLANTED | typeof TRANSPLANTED | typeof HARVESTED | typeof FERTILIZED;
export const HISTORY_STATUSES: HistoryStatus[] = [PLANTED, TRANSPLANTED, HARVESTED, FERTILIZED];

export const NOT_PLANTED = 'Not Planted';
export const CLOSED = 'Closed';
export type PlantStatus = typeof NOT_PLANTED | typeof PLANTED | typeof TRANSPLANTED | typeof CLOSED;
export const PLANT_STATUSES: PlantStatus[] = [NOT_PLANTED, PLANTED, TRANSPLANTED, CLOSED];

export interface ContainerTaskUpdateDTO {
  readonly date: string;
  readonly plantInstanceIds?: string[];
}

export interface ContainerSlotIdentifier {
  containerId: string;
  slotId: number;
}

export interface Slot {
  plant?: string | null;
  plantInstanceId?: string | null;
  plantInstanceHistory?: string[];
}

export interface SlotDTO {
  plantInstanceId?: string | null;
}

function fromSlotDTO(dto: SlotDTO): Slot {
  return {
    ...dto
  };
}

export function toSlotDTO(dto: Slot): SlotDTO {
  return {
    ...dto
  };
}

export const STARTED_FROM_TYPE_SEED = 'Seed';
export const STARTED_FROM_TYPE_TRANSPLANT = 'Transplant';
export type StartedFromType = typeof STARTED_FROM_TYPE_SEED | typeof STARTED_FROM_TYPE_TRANSPLANT;
export const STARTED_FROM_TYPES: StartedFromType[] = [STARTED_FROM_TYPE_SEED, STARTED_FROM_TYPE_TRANSPLANT];

export const SPRING = 'spring';
export const FALL = 'fall';
export type Season = typeof SPRING | typeof FALL;
export const SEASONS: Season[] = [SPRING, FALL];

export const CONTAINER_TYPE_INSIDE = 'Inside';
export const CONTAINER_TYPE_OUTSIDE = 'Outside';
export type ContainerType = typeof CONTAINER_TYPE_INSIDE | typeof CONTAINER_TYPE_OUTSIDE;
export const CONTAINER_TYPES: ContainerType[] = [CONTAINER_TYPE_INSIDE, CONTAINER_TYPE_OUTSIDE];

export interface Container {
  _id: string;
  name: string;
  type: ContainerType;
  year?: number;
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
  year?: number;
  rows: number;
  columns: number;
  slots?: Record<number, SlotDTO>;
  startedFrom?: string;
  archived?: boolean;
}

export function toStartedFromType(rawStartedFrom: unknown): StartedFromType {
  switch (rawStartedFrom) {
    case 'Transplant':
      return STARTED_FROM_TYPE_TRANSPLANT;
    default:
      return STARTED_FROM_TYPE_SEED;
  }
}

export function fromContainerDTO(dto: ContainerDTO): Container {
  return {
    ...dto,
    slots: dto.slots ? mapRecord(dto.slots, fromSlotDTO) : undefined,
    startedFrom: dto.startedFrom ? toStartedFromType(dto.startedFrom) : undefined
  };
}

export function toContainerDTO(dto: Container): ContainerDTO;
export function toContainerDTO(dto: Omit<Container, '_id'>): Omit<ContainerDTO, '_id'>;
export function toContainerDTO(dto: Omit<Container, '_id'> | Container): Omit<ContainerDTO, '_id'> | ContainerDTO {
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

export function toPictureDTO(dto: Picture): PictureDTO;
export function toPictureDTO(dto: Omit<Picture, '_id'>): Omit<PictureDTO, '_id'>;
export function toPictureDTO(dto: Omit<Picture, '_id'> | Picture): Omit<PictureDTO, '_id'> | PictureDTO {
  return {
    ...dto
  };
}

export const PLANT = 'Plant';
export const TRANSPLANT = 'Transplant';
export const HARVEST = 'Harvest';
export const FERTILIZE = 'Fertilize';
export const CUSTOM = 'Custom';
export type TaskType = typeof PLANT | typeof TRANSPLANT | typeof HARVEST | typeof FERTILIZE | typeof CUSTOM;
export const TASK_TYPES: TaskType[] = [PLANT, TRANSPLANT, HARVEST, FERTILIZE, CUSTOM];

export interface TaskGroup {
  key: string;
  text: string;
  type: TaskType;
  start: Date;
  due: Date;
  path: string | null;
  completedOn: Date | null;
  instances: {
    _id: string;
    plantInstanceId: string | null;
  }[];
}

export interface Task {
  _id: string;
  text: string;
  type: TaskType;
  start: Date;
  due: Date;
  plantInstanceId: string | null;
  path: string | null;
  completedOn: Date | null;
}

export interface TaskDTO {
  _id: string;
  text: string;
  type: TaskType;
  start: string;
  due: string;
  plantInstanceId: string | null;
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

export function toTaskDTO(dto: Task): TaskDTO;
export function toTaskDTO(dto: Omit<Task, '_id'>): Omit<TaskDTO, '_id'>;
export function toTaskDTO(dto: Omit<Task, '_id'> | Task): Omit<TaskDTO, '_id'> | TaskDTO {
  return {
    ...dto,
    start: dto.start.toISOString(),
    due: dto.due.toISOString(),
    completedOn: dto.completedOn !== null ? dto.completedOn.toISOString() : null
  };
}

export interface BulkCompleteTaskDTO {
  taskIds: string[];
  date: string;
  type: TaskType;
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

export interface SortedTasks<T extends (Task | TaskGroup) | Task> {
  tasks: T[];
  completed: T[];
  overdue: T[];
  next: T[];
  thisWeek: T[];
  active: T[];
}

export interface PlantInstanceHistory {
  from?: ContainerSlotIdentifier;
  to?: ContainerSlotIdentifier;
  status: HistoryStatus;
  date: Date;
}

export interface PlantInstanceHistoryDTO {
  from?: ContainerSlotIdentifier;
  to?: ContainerSlotIdentifier;
  status: string;
  date: string;
}

export function toStatus(rawStatus: string): HistoryStatus {
  switch (rawStatus) {
    case 'Transplanted':
      return TRANSPLANTED;
    case 'Harvested':
      return HARVESTED;
    case 'Fertilized':
      return FERTILIZED;
    default:
      return PLANTED;
  }
}

export function toSeason(raw: unknown): Season {
  if (typeof raw !== 'string') {
    return SPRING;
  }

  switch (raw) {
    case FALL:
      return FALL;
    default:
      return SPRING;
  }
}

export function fromPlantInstanceHistoryDTO(dto: PlantInstanceHistoryDTO): PlantInstanceHistory {
  return {
    ...dto,
    date: new Date(dto.date),
    status: toStatus(dto.status)
  };
}

export function toPlantInstanceHistoryDTO(dto: PlantInstanceHistory): PlantInstanceHistoryDTO {
  return {
    ...dto,
    date: dto.date.toISOString()
  };
}

export interface PlantInstance {
  _id: string;
  containerId: string;
  slotId: number;
  plant: string | null;
  created: Date;
  pictures?: PictureData[];
  comments?: Comment[];
  history?: PlantInstanceHistory[];
  closed?: boolean;
  startedFrom: StartedFromType;
  season: Season;
}

export interface PlantInstanceDTO {
  _id: string;
  containerId: string;
  slotId: number;
  plant: string | null;
  created: string;
  pictures?: PictureDataDTO[];
  comments?: CommentDTO[];
  history?: PlantInstanceHistoryDTO[];
  closed?: boolean;
  startedFrom: string;
  season: string;
}

export function fromPlantInstanceDTO(dto: PlantInstanceDTO): PlantInstance {
  return {
    ...dto,
    created: new Date(dto.created),
    pictures: dto.pictures !== undefined ? dto.pictures.map(fromPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(fromCommentDTO) : undefined,
    history: dto.history !== undefined ? dto.history.map(fromPlantInstanceHistoryDTO) : undefined,
    startedFrom: toStartedFromType(dto.startedFrom),
    season: toSeason(dto.season)
  };
}

export function toPlantInstanceDTO(dto: PlantInstance): PlantInstanceDTO;
export function toPlantInstanceDTO(dto: Omit<PlantInstance, '_id'>): PlantInstanceDTO;
export function toPlantInstanceDTO(
  dto: Omit<PlantInstance, '_id'> | PlantInstance
): Omit<PlantInstanceDTO, '_id'> | PlantInstanceDTO {
  return {
    ...dto,
    created: dto.created.toISOString(),
    pictures: dto.pictures !== undefined ? dto.pictures.map(toPictureDataDTO) : undefined,
    comments: dto.comments !== undefined ? dto.comments.map(toCommentDTO) : undefined,
    history: dto.history !== undefined ? dto.history.map(toPlantInstanceHistoryDTO) : undefined
  };
}

export interface PlantInstanceAddHistoryAndUpdateTaskDTO {
  readonly date: string;
}

export interface BulkReopenClosePlantInstanceDTO {
  readonly plantInstanceIds: string[];
  readonly action: 'reopen' | 'close';
}

export interface SessionDTO {
  readonly userId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly accessToken?: string;
  readonly refreshToken?: string;
}

export interface LoginDTO {
  readonly email: string;
  readonly password: string;
}
export interface ValidateTokenDTO {
  readonly email: string;
  readonly token: string;
}

export interface GenerateTokenDTO {
  readonly email: string;
}

export interface UserDTO {
  readonly email: string;
  readonly password?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly summaryEmail: boolean;
  readonly zipCode: string;
}

export interface Garden {
  _id: string;
  name: string;
  retired?: boolean;
}

export type GardenDTO = Garden;

export function fromGardenDTO(dto: GardenDTO): Garden {
  return {
    ...dto
  };
}

export function toGardenDTO(dto: Garden): GardenDTO;
export function toGardenDTO(dto: Omit<Garden, '_id'>): Omit<GardenDTO, '_id'>;
export function toGardenDTO(dto: Omit<Garden, '_id'> | Garden): Omit<GardenDTO, '_id'> | GardenDTO {
  return {
    ...dto
  };
}
