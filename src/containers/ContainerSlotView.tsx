import { Container, PlantInstance, Slot } from '../interface';
import ContainerSlotViewActive from './ContainerSlotViewActive';
import ContainerSlotViewPlanning from './ContainerSlotViewPlanning';

interface ContainerSlotViewProps {
  id: string;
  index: number;
  container: Container;
  slot: Slot;
  plantInstance: PlantInstance | undefined;
  onSlotChange: (slot: Slot) => Promise<Container | undefined>;
}

const ContainerSlotView = ({ id, index, container, slot, plantInstance, onSlotChange }: ContainerSlotViewProps) => {
  return plantInstance ? (
    <ContainerSlotViewActive
      id={id}
      index={index}
      container={container}
      slot={slot}
      plantInstance={plantInstance}
      onSlotChange={onSlotChange}
    />
  ) : (
    <ContainerSlotViewPlanning id={id} index={index} container={container} slot={slot} onSlotChange={onSlotChange} />
  );
};

export default ContainerSlotView;
