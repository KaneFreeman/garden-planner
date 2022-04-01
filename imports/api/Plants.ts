import { Mongo } from 'meteor/mongo';
import { Picture, Comment } from './Common';

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
export const COVER_CROP = 'Cover Crop';
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
export const MICROGREENS = 'Microgreens';
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
export const SALAD_GREENS = 'Salad Greens';
export const SHALLOT = 'Shallot';
export const SPINACH = 'Spinach';
export const SPROUTING_SEED = 'Sprouting Seed';
export const SQUASH = 'Squash';
export const SWEET_POTATOE = 'Sweet Potatoe';
export const SWISS_CHARD = 'Swiss Chard';
export const TOMATILLOE = 'Tomatilloe';
export const TOMATOE = 'Tomatoe';
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
  | typeof COVER_CROP
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
  | typeof MICROGREENS
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
  | typeof SALAD_GREENS
  | typeof SHALLOT
  | typeof SPINACH
  | typeof SPROUTING_SEED
  | typeof SQUASH
  | typeof SWEET_POTATOE
  | typeof SWISS_CHARD
  | typeof TOMATILLOE
  | typeof TOMATOE
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
  | typeof VERBENA;

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
  COVER_CROP,
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
  MICROGREENS,
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
  SALAD_GREENS,
  SHALLOT,
  SPINACH,
  SPROUTING_SEED,
  SQUASH,
  SWEET_POTATOE,
  SWISS_CHARD,
  TOMATILLOE,
  TOMATOE,
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
  VERBENA
];

export interface Plant {
  _id?: string;
  name: string;
  type?: PlantType;
  url?: string;
  daysToMaturity?: [number | undefined, number | undefined];
  pictures?: Picture[];
  comments?: Comment[];
}

export const PlantsCollection = new Mongo.Collection<Plant>('plants');
