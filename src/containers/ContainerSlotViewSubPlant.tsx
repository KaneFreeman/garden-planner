import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import { BaseSlot, Container, Plant, PlantInstance } from '../interface';
import { getPlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { getPlantInstanceStatusForSlot } from '../plant-instances/hooks/usePlantInstanceStatus';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlants } from '../plants/usePlants';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';
import { getPlantTitle } from '../utility/plant.util';
import { getSlotTitle } from '../utility/slot.util';
import DisplayStatusChip, { DisplayStatusChipProps } from './DisplayStatusChip';

interface CircleProps {
  backgroundColor: string;
}

const Circle = styled(Box)<CircleProps>(({ backgroundColor }) => ({
  borderRadius: '50%',
  backgroundColor,
  width: 32,
  height: 32,
  marginLeft: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8125rem'
}));

interface ContainerSlotViewSubPlantProps {
  id: string;
  index: number;
  container: Container;
  subSlot?: BaseSlot;
  subPlantInstance?: PlantInstance;
}

const ContainerSlotViewSubPlant = ({
  id,
  index,
  container,
  subSlot,
  subPlantInstance
}: ContainerSlotViewSubPlantProps) => {
  const navigate = useNavigate();

  const plants = usePlants();

  const path = useMemo(() => (id ? `/container/${id}/slot/${index}` : undefined), [id, index]);
  const subPlantTasks = useTasksByPlantInstance(subPlantInstance?._id);

  const title = useMemo(() => getSlotTitle(index, container?.rows), [container?.rows, index]);

  const subPlant = useMemo(
    () =>
      plants.find((otherPlant) =>
        subPlantInstance ? otherPlant._id === subPlantInstance?.plant : otherPlant._id === subSlot?.plant
      ),
    [plants, subPlantInstance, subSlot?.plant]
  );

  const onPlantClick = useCallback(
    (target: Plant) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (target && path) {
        event.stopPropagation();
        navigate(`/plant/${target._id}?backPath=${path}&backLabel=${title}`);
      }
    },
    [navigate, path, title]
  );

  const onSubPlantClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (path) {
        event.stopPropagation();
        navigate(`${path}/sub-slot`);
      }
    },
    [navigate, path]
  );

  const renderStatus = useCallback(
    (status: DisplayStatusChipProps['status']) => <DisplayStatusChip status={status} size="large" />,
    []
  );

  const renderedSubPlant = useMemo(() => {
    const subLocation = getPlantInstanceLocation(subPlantInstance);
    const subStatus = getPlantInstanceStatusForSlot(
      subPlantInstance,
      {
        containerId: id,
        slotId: index,
        subSlot: true
      },
      subLocation
    );
    const subDisplayStatus = renderStatus(subStatus);

    const { active, thisWeek, overdue } = subPlantTasks;

    let badge: ReactNode = null;
    if (overdue.length > 0) {
      badge = <Circle backgroundColor="error.main">{overdue.length}</Circle>;
    } else if (thisWeek.length > 0) {
      badge = <Circle backgroundColor="warning.main">{thisWeek.length}</Circle>;
    } else if (active.length > 0) {
      badge = <Circle backgroundColor="primary.main">{active.length}</Circle>;
    }

    return (
      <ListItemButton key="sub-plant" onClick={onSubPlantClick} sx={{ ml: -2, mr: -2 }}>
        {subPlant ? (
          <>
            <ListItemAvatar sx={{ display: 'flex' }}>
              <PlantAvatar plant={subPlant} />
            </ListItemAvatar>
            <Button variant="text" onClick={onPlantClick(subPlant)} sx={{ ml: -1 }}>
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {getPlantTitle(subPlant)}
              </Box>
            </Button>
            {subPlantInstance ? subDisplayStatus : null}
            {badge}
          </>
        ) : (
          <ListItemText primary="None" />
        )}
      </ListItemButton>
    );
  }, [subPlantInstance, id, index, renderStatus, subPlantTasks, onSubPlantClick, subPlant, onPlantClick]);

  return <SimpleInlineField label="Sub Plant" value={renderedSubPlant} />;
};

export default ContainerSlotViewSubPlant;
