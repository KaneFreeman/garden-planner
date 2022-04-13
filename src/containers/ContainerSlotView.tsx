/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MuiTextField from '@mui/material/TextField';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import PicturesView from '../pictures/PicturesView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantAvatar from '../plants/PlantAvatar';
import NumberTextField from '../components/NumberTextField';
import DateInlineField from '../components/inline-fields/DateInlineField';
import CommentsView from '../components/comments/CommentsView';
import NumberInlineField from '../components/inline-fields/NumberInlineField';
import getSlotTitle from '../utility/slot.util';
import { PictureData, Plant, Slot, Comment, Status, STATUSES, Container, BaseSlot } from '../interface';
import { usePlants } from '../plants/usePlants';
import { useContainers } from './useContainers';
import Select from '../components/Select';
import ContainerSlotSelectInlineField from '../components/inline-fields/ContainerSlotSelectInlineField';
import ContainerSlotTasksView from '../tasks/container/ContainerSlotTasksView';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';

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

  const containers = useContainers();
  const containersById = useMemo(
    () =>
      containers.reduce((byId, someContainer) => {
        // eslint-disable-next-line no-param-reassign
        byId[someContainer._id] = someContainer;
        return byId;
      }, {} as Record<string, Container>),
    [containers]
  );

  const plants = usePlants();

  const [transplantedToContainerId, setTransplantedToContainerId] = useState<string | null>(
    slot.transplantedTo?.containerId ?? null
  );
  const [transplantedToSlotId, setTransplantedToSlotId] = useState<number | null>(slot.transplantedTo?.slotId ?? null);

  useEffect(() => {
    setTransplantedToContainerId(slot.transplantedTo?.containerId ?? null);
    setTransplantedToSlotId(slot.transplantedTo?.slotId ?? null);
  }, [slot]);

  const [showHowManyPlanted, setShowHowManyPlanted] = useState(false);
  const [plantedCount, setPlantedCount] = useState(1);
  const [plantedDate, setPlantedDate] = useState<Date>(new Date());

  const transplantedToContainer = useMemo(() => {
    if (!transplantedToContainerId) {
      return undefined;
    }

    return containersById[transplantedToContainerId];
  }, [containersById, transplantedToContainerId]);

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
      if (target) {
        event.stopPropagation();
        navigate(`/plant/${target._id}?backPath=/container/${id}/slot/${index}&backLabel=${title}`);
      }
    },
    [id, index, navigate, title]
  );

  const onSubPlantClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (slot.plant) {
        event.stopPropagation();
        navigate(`/container/${id}/slot/${index}/sub-slot`);
      }
    },
    [id, index, navigate, slot.plant]
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

    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    if (value === 'Planted') {
      color = 'success';
    } else if (value === 'Transplanted') {
      color = 'error';
    }

    return {
      raw: <Chip label={value} color={color} />
    };
  }, []);

  const renderedSubPlant = useMemo(() => {
    if (!subSlot) {
      return 'None';
    }

    const { raw } = renderStatus(subSlot?.status ?? 'Not Planted') ?? {};

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
          </>
        ) : (
          <ListItemText primary="None" />
        )}
      </ListItemButton>
    );
  }, [subSlot, renderStatus, onSubPlantClick, subPlant, onPlantClick]);

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

  const finishUpdateStatusPlanted = useCallback(() => {
    updateSlot({ status: 'Planted', plantedCount, plantedDate });
    setShowHowManyPlanted(false);
    setPlantedCount(1);
  }, [plantedCount, plantedDate, updateSlot]);

  const finishUpdateStatusTransplanted = useCallback(() => {
    if (transplantedToContainerId !== null && transplantedToSlotId !== null) {
      updateSlot({
        status: 'Transplanted',
        transplantedDate,
        transplantedTo: {
          containerId: transplantedToContainerId,
          slotId: transplantedToSlotId
        }
      });
    } else {
      updateSlot({ status: 'Transplanted', transplantedDate, transplantedTo: null });
    }
    setShowTransplantedModal(false);
    setTransplantedToContainerId(null);
    setTransplantedToSlotId(null);
  }, [transplantedDate, transplantedToContainerId, transplantedToSlotId, updateSlot]);

  const slotOptions = useMemo(
    () =>
      transplantedToContainer
        ? [...Array(transplantedToContainer.rows * transplantedToContainer.columns)].map((_, entry) => ({
            label: getSlotTitle(entry, transplantedToContainer.rows),
            value: entry
          }))
        : [],
    [transplantedToContainer]
  );

  if (!container) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/container/${container._id}`)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6">{container.name}</Typography>
          </Link>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/container/${container._id}/slot/${index}`)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6" color={type === 'slot' ? 'text.primary' : undefined}>
              {title}
            </Typography>
          </Link>
          {type === 'sub-slot' ? (
            <Typography variant="h6" color="text.primary">
              Sub Plant
            </Typography>
          ) : null}
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
          <ContainerSlotSelectInlineField
            label="Transplanted From"
            value={slot.transplantedFrom}
            onChange={(transplantedFrom) => updateSlot({ transplantedFrom })}
          />
        ) : null}
        <ContainerSlotTasksView containerId={id} slotId={index} type={type} />
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
                onChange={(newValue) => {
                  if (transplantedToContainerId !== newValue) {
                    setTransplantedToContainerId(newValue ?? null);
                    setTransplantedToSlotId(null);
                  }
                }}
                options={containers?.map((entry) => ({
                  label: entry.name,
                  value: entry._id
                }))}
              />
              <Select
                label="Slot"
                value={transplantedToSlotId ?? undefined}
                disabled={slotOptions.length === 0}
                onChange={(newValue) => setTransplantedToSlotId(newValue ?? null)}
                options={slotOptions}
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlotView;
