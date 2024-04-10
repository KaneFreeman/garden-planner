import { BaseSlot, Container, PlantInstance } from '../interface';
import ContainerSlotViewActive from './ContainerSlotViewActive';
import ContainerSlotViewPlanning from './ContainerSlotViewPlanning';

interface ContainerSlotViewProps {
  id: string;
  index: number;
  type: 'slot' | 'sub-slot';
  container: Container;
  slot: BaseSlot;
  plantInstance: PlantInstance | undefined;
  subSlot?: BaseSlot;
  subPlantInstance?: PlantInstance;
  onSlotChange: (slot: BaseSlot) => Promise<Container | undefined>;
}

const ContainerSlotView = ({
  id,
  index,
  type,
  container,
  slot,
  plantInstance,
  subSlot,
  subPlantInstance,
  onSlotChange
}: ContainerSlotViewProps) => {
  return plantInstance ? (
    <ContainerSlotViewActive
      id={id}
      index={index}
      type={type}
      container={container}
      slot={slot}
      plantInstance={plantInstance}
      subSlot={subSlot}
      subPlantInstance={subPlantInstance}
      onSlotChange={onSlotChange}
    />
  ) : (
    <ContainerSlotViewPlanning
      id={id}
      index={index}
      type={type}
      container={container}
      slot={slot}
      subSlot={subSlot}
      subPlantInstance={subPlantInstance}
      onSlotChange={onSlotChange}
    />
  );
};

export default ContainerSlotView;
