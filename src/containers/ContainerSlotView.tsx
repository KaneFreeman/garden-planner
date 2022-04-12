/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import PicturesView from '../pictures/PicturesView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantAvatar from '../plants/PlantAvatar';
import NumberTextField from '../components/NumberTextField';
import DateInlineField from '../components/inline-fields/DateInlineField';
import CommentsView from '../components/comments/CommentsView';
import NumberInlineField from '../components/inline-fields/NumberInlineField';
import getSlotTitle from '../utility/slot.util';
import { PictureData, Plant, Slot, Comment, Status, STATUSES, Container } from '../interface';
import { usePlants } from '../plants/usePlants';
import { useContainer, useContainers, useUpdateContainer } from './useContainers';
import Select from '../components/Select';
import ContainerSlotSelectInlineField from '../components/inline-fields/ContainerSlotSelectInlineField';
import ContainerSlotTasksView from '../tasks/container/ContainerSlotTasksView';

const ContainerSlot = () => {
  const navigate = useNavigate();

  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const [version, setVersion] = useState(0);
  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedDate, setTransplantedDate] = useState<Date>(new Date());

  const updateContainer = useUpdateContainer();
  const containers = useContainers();
  const containersById = useMemo(
    () =>
      containers.reduce((byId, container) => {
        // eslint-disable-next-line no-param-reassign
        byId[container._id] = container;
        return byId;
      }, {} as Record<string, Container>),
    [containers]
  );

  const container = useContainer(id);
  const plants = usePlants();

  const slot = useMemo(
    () =>
      container?.slots?.[indexNumber] ??
      ({
        transplantedFrom: null,
        transplantedTo: null
      } as Slot),
    [container?.slots, indexNumber]
  );

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
      if (id && container) {
        const newSlot: Slot = {
          ...(container.slots?.[indexNumber] ?? {
            transplantedTo: null,
            transplantedFrom: null
          }),
          ...data
        };

        const newSlots = { ...(container.slots ?? {}) };
        newSlots[indexNumber] = newSlot;

        // eslint-disable-next-line promise/catch-or-return
        updateContainer({ ...container, slots: newSlots }).finally(() => {
          setVersion(version + 1);
        });
      }
    },
    [container, id, indexNumber, updateContainer, version]
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

  const title = useMemo(() => getSlotTitle(indexNumber, container?.rows), [container?.rows, indexNumber]);

  const plant = useMemo(() => plants.find((otherPlant) => otherPlant._id === slot.plant), [plants, slot]);

  const updatePlant = useCallback(
    (value: Plant) => {
      if (value) {
        updateSlot({ plant: value._id });
      }
    },
    [updateSlot]
  );

  const onPlantClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (slot.plant) {
        event.stopPropagation();
        navigate(`/plant/${slot.plant}?backPath=/container/${id}/slot/${index}&backLabel=${title}`);
      }
    },
    [id, index, navigate, slot.plant, title]
  );

  const renderPlant = useCallback(
    (value: Plant | undefined, listType: 'value' | 'options') => {
      if (!value) {
        return undefined;
      }

      if (listType === 'value') {
        return {
          raw: (
            <Button variant="text" onClick={onPlantClick} sx={{ ml: -1 }}>
              {value.name}
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

  const updateStatus = useCallback(
    (value: Status) => {
      if (value) {
        if (value === 'Planted') {
          setPlantedDate(new Date());
          setShowHowManyPlanted(true);
          return;
        }
        if (value === 'Transplanted') {
          setTransplantedDate(new Date());
          setShowTransplantedModal(true);
          return;
        }
        updateSlot({ status: value });
      }
    },
    [updateSlot]
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

  const renderStatus = useCallback((value: Status | undefined) => {
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
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        </Breadcrumbs>
        <DrawerInlineSelect
          label="Status"
          value={slot.status}
          defaultValue="Not Planted"
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
        {slot.transplantedFrom !== null ? (
          <ContainerSlotSelectInlineField
            label="Transplanted From"
            value={slot.transplantedFrom}
            onChange={(transplantedFrom) => updateSlot({ transplantedFrom })}
          />
        ) : null}
        <ContainerSlotTasksView containerId={id} slotId={indexNumber} version={version} />
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

export default ContainerSlot;
