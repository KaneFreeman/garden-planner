/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography
} from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import { Picture, Comment } from '../../api/Common';
import { ContainersCollection, Slot, Status, STATUSES } from '../../api/Containers';
import { PlantsCollection, Plant } from '../../api/Plants';
import PicturesView from '../components/pictures/PicturesView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantAvatar from '../plants/PlantAvatar';
import NumberTextField from '../components/NumberTextField';
import DateInlineField from '../components/inline-fields/DateInlineField';
import CommentsView from '../components/comments/CommentsView';
import NumberInlineField from '../components/inline-fields/NumberInlineField';

const ContainerSlot = () => {
  const navigate = useNavigate();

  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const [showHowManyPlanted, setShowHowManyPlanted] = useState(false);
  const [plantedCount, setPlantedCount] = useState(1);

  const container = useTracker(() => ContainersCollection.findOne(id), [id]);
  const plants = useTracker(
    () =>
      PlantsCollection.find()
        .fetch()
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const updateSlot = useCallback(
    (data: Partial<Slot>) => {
      if (id && container) {
        const newSlot: Slot = { ...(container.slots?.[indexNumber] ?? {}), ...data };

        const newSlots = { ...(container.slots ?? {}) };
        newSlots[indexNumber] = newSlot;

        ContainersCollection.update(id, { $set: { slots: newSlots } });
      }
    },
    [container, id, indexNumber]
  );

  const updatePictures = useCallback(
    (pictures: Picture[]) => {
      if (id && container) {
        updateSlot({ pictures });
      }
    },
    [id, container, updateSlot]
  );

  const updateComments = useCallback(
    (comments: Comment[], pictures?: Picture[]) => {
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

  const slot = useMemo(() => container?.slots?.[indexNumber] ?? {}, [container?.slots, indexNumber]);

  const column = useMemo(() => Math.floor((indexNumber + 1) / (container?.rows ?? 1)), [container?.rows, indexNumber]);

  const row = useMemo(() => indexNumber % ((container?.rows ?? 1) * column), [container?.rows, indexNumber, column]);

  const title = useMemo(() => `Row ${row + 1}, Column ${column + 1}`, [column, row]);

  const plant = useMemo(() => plants.find((otherPlant) => otherPlant._id === slot.plant), [plants, slot]);

  const updatePlant = useCallback(
    (value: Plant) => {
      if (value) {
        updateSlot({ plant: value._id });
      }
    },
    [updateSlot]
  );

  const renderPlant = useCallback((value: Plant | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: value.name,
      avatar: <PlantAvatar plant={value} />
    };
  }, []);

  const updateStatus = useCallback(
    (value: Status) => {
      if (value) {
        if (value === 'Planted') {
          setShowHowManyPlanted(true);
          return;
        }
        updateSlot({ status: value });
      }
    },
    [updateSlot]
  );

  const finishUpdateStatusPlanted = useCallback(() => {
    updateSlot({ status: 'Planted', plantedCount, plantedDate: new Date() });
    setShowHowManyPlanted(false);
    setPlantedCount(1);
  }, [plantedCount, updateSlot]);

  const renderStatus = useCallback((value: Status | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      chip: <Chip label={value} color={value === 'Not Planted' ? 'default' : 'success'} />
    };
  }, []);

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
          <Link underline="hover" color="inherit" onClick={() => navigate(`/container/${container._id}`)}>
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
          render={renderStatus}
          sx={{ mt: 1 }}
        />
        <DrawerInlineSelect
          label="Plant"
          value={plant}
          noValueLabel="No plant"
          options={plants}
          onChange={updatePlant}
          render={renderPlant}
          sx={{ mt: 1 }}
        />
        {slot.status === 'Planted' ? (
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
        <PicturesView
          key="container-slot-view-pictures"
          pictures={slot.pictures}
          comments={slot.comments}
          alt={title}
          onChange={updatePictures}
        />
        <CommentsView comments={slot.comments} alt={title} pictures={slot.pictures} onChange={updateComments} />
      </Box>
      <Dialog open={showHowManyPlanted} onClose={() => setShowHowManyPlanted(false)} maxWidth="sm" fullWidth>
        <DialogTitle>How many did you plant?</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={finishUpdateStatusPlanted} noValidate>
            <NumberTextField label="Count" value={plantedCount} onChange={setPlantedCount} required />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHowManyPlanted(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusPlanted} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlot;
