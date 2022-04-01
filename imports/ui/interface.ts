export interface PlantData {
  howToGrow: {
    indoor?: {
      indoor_min: string | null;
      indoor_max: string | null;
      transplant_min: string | null;
      transplant_max: string | null;
      fall_indoor_min: string | null;
      fall_indoor_max: string | null;
      fall_transplant_min: string | null;
      fall_transplant_max: string | null;
    };
    plant?: {
      transplant_min: string | null;
      transplant_max: string | null;
      fall_transplant_min: string | null;
      fall_transplant_max: string | null;
    };
    outdoor?: {
      direct_min: string | null;
      direct_max: string | null;
      fall_direct_min: string | null;
      fall_direct_max: string | null;
    };
  };
  faq: {
    how_to_grow?: [string, string][];
  };
}
