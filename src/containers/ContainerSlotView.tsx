/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiTextField from '@mui/material/TextField';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { blue, red, yellow } from '@mui/material/colors';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import PicturesView from '../pictures/PicturesView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantAvatar from '../plants/PlantAvatar';
import NumberTextField from '../components/NumberTextField';
import DateInlineField from '../components/inline-fields/DateInlineField';
import CommentsView from '../components/comments/CommentsView';
import NumberInlineField from '../components/inline-fields/NumberInlineField';
import { getSlotTitle } from '../utility/slot.util';
import {
  PictureData,
  Plant,
  Slot,
  Comment,
  Status,
  STATUSES,
  Container,
  BaseSlot,
  STARTED_FROM_TYPES,
  StartedFromType
} from '../interface';
import { usePlants } from '../plants/usePlants';
import Select from '../components/Select';
import ContainerSlotSelectInlineField from '../components/inline-fields/ContainerSlotSelectInlineField';
import ContainerSlotTasksView from '../tasks/container/ContainerSlotTasksView';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import { useTasksByPath } from '../tasks/hooks/useTasks';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';
import useContainerOptions from './hooks/useContainerOptions';
import StatusChip from './StatusChip';

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

interface ContainerSlotViewProps {
  id: string | undefined;
  index: number;
  type: 'slot' | 'sub-slot';
  container: Container | undefined;
  slot: BaseSlot;
  subSlot?: BaseSlot;
  onChange: (slot: BaseSlot) => Promise<Container | undefined>;
}

const ContainerSlotView = ({ id, index, type, container, slot, subSlot, onChange }: ContainerSlotViewProps) => {
  const navigate = useNavigate();

  const [version, setVersion] = useState(0);
  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedDate, setTransplantedDate] = useState<Date>(new Date());

  const plants = usePlants();

  const path = useMemo(() => (id ? `/container/${id}/slot/${index}` : undefined), [id, index]);
  const subPlantPath = useMemo(() => (path ? `${path}/sub-slot` : undefined), [path]);
  const subPlantTasks = useTasksByPath(subPlantPath);

  const [transplantedToContainerId, setTransplantedToContainerId] = useState<string | null>(
    slot.transplantedTo?.containerId ?? null
  );

  useEffect(() => {
    setTransplantedToContainerId(slot.transplantedTo?.containerId ?? null);
  }, [slot]);

  const [showHowManyPlanted, setShowHowManyPlanted] = useState(false);
  const [plantedCount, setPlantedCount] = useState(1);
  const [plantedDate, setPlantedDate] = useState<Date>(new Date());

  const updateSlot = useCallback(
    (data: Partial<Slot>) => {
      const newSlot: Slot = {
        ...slot,
        ...data
      };

      // eslint-disable-next-line promise/catch-or-return
      onChange(newSlot).finally(() => {
        setVersion(version + 1);
      });
    },
    [onChange, slot, version]
  );

  const updatePictures = useCallback(
    (pictures: PictureData[]) => {
      if (id && container) {
        updateSlot({ pictures });
      }
    },
    [id, container, updateSlot]
  );

  const updateComments = useCallback(
    (comments: Comment[], pictures?: PictureData[]) => {
      if (id && container) {
        if (pictures) {
          updateSlot({ comments, pictures });
          return;
        }
        updateSlot({ comments });
      }
    },
    [id, container, updateSlot]
  );

  const title = useMemo(() => getSlotTitle(index, container?.rows), [container?.rows, index]);

  const plant = useMemo(() => plants.find((otherPlant) => otherPlant._id === slot.plant), [plants, slot]);
  const subPlant = useMemo(
    () => plants.find((otherPlant) => otherPlant._id === subSlot?.plant),
    [plants, subSlot?.plant]
  );

  const updatePlant = useCallback(
    (value: Plant | null) => {
      updateSlot({ plant: value?._id });
    },
    [updateSlot]
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
      if (slot.plant && path) {
        event.stopPropagation();
        navigate(`${path}/sub-slot`);
      }
    },
    [navigate, path, slot.plant]
  );

  const renderPlant = useCallback(
    (value: Plant | null | undefined, listType: 'value' | 'options') => {
      if (!value) {
        return undefined;
      }

      if (listType === 'value') {
        return {
          raw: (
            <Button variant="text" onClick={onPlantClick(value)} sx={{ ml: -1 }}>
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {value.name}
              </Box>
            </Button>
          ),
          avatar: <PlantAvatar plant={value} />
        };
      }

      return {
        primary: value.name,
        avatar: <PlantAvatar plant={value} />
      };
    },
    [onPlantClick]
  );

  const renderStatus = useCallback((value: Status | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      raw: <StatusChip status={value} size="large" />
    };
  }, []);

  const renderedSubPlant = useMemo(() => {
    if (!subSlot) {
      return 'None';
    }

    const { raw } = renderStatus(subSlot?.status ?? 'Not Planted') ?? {};

    const { active, thisWeek, overdue } = subPlantTasks;

    let badge: ReactNode = null;
    if (overdue.length > 0) {
      badge = <Circle backgroundColor={red[500]}>{overdue.length}</Circle>;
    } else if (thisWeek.length > 0) {
      badge = <Circle backgroundColor={yellow[500]}>{thisWeek.length}</Circle>;
    } else if (active.length > 0) {
      badge = <Circle backgroundColor={blue[500]}>{active.length}</Circle>;
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
                {subPlant.name}
              </Box>
            </Button>
            {raw ?? null}
            {badge}
          </>
        ) : (
          <ListItemText primary="None" />
        )}
      </ListItemButton>
    );
  }, [subSlot, renderStatus, subPlantTasks, onSubPlantClick, subPlant, onPlantClick]);

  const updateStatus = useCallback(
    (value: Status) => {
      if (value) {
        if (value === 'Planted') {
          setPlantedDate(slot.plantedDate ?? new Date());
          setShowHowManyPlanted(true);
          return;
        }
        if (value === 'Transplanted') {
          setTransplantedDate(slot.transplantedDate ?? new Date());
          setShowTransplantedModal(true);
          return;
        }
        updateSlot({ status: value });
      }
    },
    [slot.plantedDate, slot.transplantedDate, updateSlot]
  );

  const updateStartedFrom = useCallback(
    (value: StartedFromType) => {
      if (value) {
        updateSlot({ startedFrom: value });
      }
    },
    [updateSlot]
  );

  const renderStartedFrom = useCallback((value: StartedFromType | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: value
    };
  }, []);

  const finishUpdateStatusPlanted = useCallback(() => {
    updateSlot({ status: 'Planted', plantedCount, plantedDate });
    setShowHowManyPlanted(false);
    setPlantedCount(1);
  }, [plantedCount, plantedDate, updateSlot]);

  const finishUpdateStatusTransplanted = useCallback(() => {
    if (transplantedToContainerId !== null) {
      navigate(
        `/container/${
          container?._id
        }/slot/${index}/transplant/${transplantedToContainerId}?date=${transplantedDate.getTime()}&subSlot=${
          type === 'sub-slot'
        }&updateStatus=true`
      );
    } else {
      updateSlot({ status: 'Transplanted', transplantedDate, transplantedTo: null });
    }
    setShowTransplantedModal(false);
    setTransplantedToContainerId(null);
  }, [container?._id, index, navigate, transplantedDate, transplantedToContainerId, type, updateSlot]);

  const onTransplantContainerChange = useCallback(
    (newValue: string | undefined) => {
      if (transplantedToContainerId !== newValue) {
        setTransplantedToContainerId(newValue ?? null);
      }
    },
    [transplantedToContainerId]
  );

  const containerOptions = useContainerOptions();

  if (!container) {
    return <Loading />;
  }

  return (
    <>
      <Box sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
        <Breadcrumbs
          trail={[
            {
              to: `/containers`,
              label: 'Containers'
            },
            {
              to: `/container/${container._id}`,
              label: container.name
            },
            type === 'sub-slot'
              ? {
                  to: `/container/${container._id}/slot/${index}`,
                  label: title
                }
              : null
          ]}
        >
          {{
            current: type === 'sub-slot' ? 'Sub Plant' : title
          }}
        </Breadcrumbs>
        <DrawerInlineSelect
          label="Status"
          value={slot.status}
          defaultValue="Not Planted"
          required
          options={STATUSES}
          onChange={updateStatus}
          renderer={renderStatus}
          sx={{ mt: 1 }}
        />
        <DrawerInlineSelect
          label="Plant"
          value={plant}
          noValueLabel="No plant"
          options={plants}
          onChange={updatePlant}
          renderer={renderPlant}
          sx={{ mt: 1 }}
        />
        <DrawerInlineSelect
          label="Started From"
          value={slot.startedFrom}
          defaultValue="Seed"
          required
          options={STARTED_FROM_TYPES}
          onChange={updateStartedFrom}
          renderer={renderStartedFrom}
          sx={{ mt: 1 }}
        />
        {type === 'slot' ? <SimpleInlineField label="Sub Plant" value={renderedSubPlant} /> : null}
        {slot.status && slot.status !== 'Not Planted' ? (
          <>
            <DateInlineField
              label="Planted Date"
              value={slot.plantedDate}
              onChange={(value) => updateSlot({ plantedDate: value })}
            />
            <NumberInlineField
              label="Planted Count"
              value={slot.plantedCount}
              onChange={(value) => updateSlot({ plantedCount: value })}
              wholeNumber
              min={0}
            />
          </>
        ) : null}
        {slot.status === 'Transplanted' ? (
          <>
            <DateInlineField
              label="Transplanted Date"
              value={slot.transplantedDate}
              onChange={(newTransplantedDate) => updateSlot({ transplantedDate: newTransplantedDate })}
            />
            <ContainerSlotSelectInlineField
              label="Transplanted To"
              value={slot.transplantedTo}
              onChange={(transplantedTo) => updateSlot({ transplantedTo })}
            />
          </>
        ) : null}
        {slot.status !== 'Not Planted' ? (
          <>
            <DateInlineField
              label="Transplanted From Date"
              value={slot.transplantedFromDate}
              onChange={(newTransplantedFromDate) => updateSlot({ transplantedFromDate: newTransplantedFromDate })}
            />
            <ContainerSlotSelectInlineField
              label="Transplanted From"
              value={slot.transplantedFrom}
              onChange={(transplantedFrom) => updateSlot({ transplantedFrom })}
            />
          </>
        ) : null}
        <ContainerSlotTasksView containerId={id} slotId={index} slotTitle={title} type={type} />
        <PicturesView
          key="container-slot-view-pictures"
          pictures={slot.pictures}
          comments={slot.comments}
          alt={title}
          onChange={updatePictures}
        />
        <CommentsView
          id={`container-${id}-slot-${index}`}
          comments={slot.comments}
          alt={title}
          pictures={slot.pictures}
          onChange={updateComments}
        />
      </Box>
      <Dialog open={showHowManyPlanted} onClose={() => setShowHowManyPlanted(false)} maxWidth="xs" fullWidth>
        <DialogTitle>How many did you plant?</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={finishUpdateStatusPlanted} noValidate>
            <NumberTextField
              label="Count"
              value={plantedCount}
              onChange={setPlantedCount}
              required
              variant="outlined"
            />
            <Box sx={{ display: 'flex', pt: 2 }}>
              <MobileDateTimePicker
                label="Planted On"
                value={plantedDate}
                onChange={(newPlantedDate: Date | null) => newPlantedDate && setPlantedDate(newPlantedDate)}
                renderInput={(params) => (
                  <MuiTextField {...params} className="planted-dateTimeInput" sx={{ flexGrow: 1 }} />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHowManyPlanted(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusPlanted} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showTransplantedModal} onClose={() => setShowHowManyPlanted(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Transplant</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={finishUpdateStatusTransplanted} noValidate>
            <Box sx={{ display: 'flex', mt: 1, mb: 2, gap: 1 }}>
              <Select
                label="Container"
                value={transplantedToContainerId ?? undefined}
                onChange={onTransplantContainerChange}
                options={containerOptions}
              />
            </Box>
            <Box sx={{ display: 'flex', mt: 1, mb: 0.5 }}>
              <MobileDateTimePicker
                label="Transplanted On"
                value={transplantedDate}
                onChange={(newPlantedDate: Date | null) => newPlantedDate && setTransplantedDate(newPlantedDate)}
                renderInput={(params) => (
                  <MuiTextField {...params} className="transplanted-dateTimeInput" sx={{ flexGrow: 1 }} />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTransplantedModal(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusTransplanted} variant="contained">
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlotView;
