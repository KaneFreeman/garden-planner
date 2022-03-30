import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import { Plant, PlantsCollection } from '../../api/Plants';
import TextField from '../components/TextField';

interface PlantModalProperties {
  id?: string | undefined;
  open: boolean;
  onClose: () => void;
}

function isValidPlant(plant: Partial<Plant> | undefined): plant is Plant {
  return plant?.name !== undefined;
}

const PlantModal = ({ id, open, onClose }: PlantModalProperties) => {
  const plant = useTracker(() => {
    if (!id) {
      return undefined;
    }
    return PlantsCollection.findOne(id);
  }, [id]);

  const [editData, setEditData] = useState<Partial<Plant>>();

  useEffect(() => {
    setEditData(plant);
  }, [plant]);

  const onSave = useCallback(() => {
    if (plant?._id !== undefined) {
      PlantsCollection.update(plant._id, { $set: editData });
      onClose();
      return;
    }

    if (isValidPlant(editData)) {
      PlantsCollection.insert(editData as Plant);
      onClose();
    }
  }, [editData, plant, onClose]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const title = useMemo(() => `${plant?._id === undefined ? 'Add' : 'Edit'} Plant`, [plant]);
  const action = useMemo(() => (plant?._id === undefined ? 'Create' : 'Save'), [plant]);

  const update = useCallback(
    (data: Partial<Plant>) => {
      setEditData({
        ...editData,
        ...data
      });
    },
    [editData]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form name="plant-modal-form" onSubmit={onSubmit} noValidate>
          <TextField autoFocus label="Name" value={editData?.name} onChange={(name) => update({ name })} required />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlantModal;
