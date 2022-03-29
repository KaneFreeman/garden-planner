import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import { Plant, PlantsCollection } from '../../api/Plants';
import NumberTextField from '../components/NumberTextField';
import TextField from '../components/TextField';

interface PlantModalProperties {
  id?: string | undefined;
  open: boolean;
  onClose: () => void;
}

function isValidPlant(plant: Partial<Plant> | undefined): plant is Plant {
  return plant?.name !== undefined;
}

export const PlantModal = ({ id, open, onClose }: PlantModalProperties) => {
  const Plant = useTracker(() => {
    if (!id) {
      return undefined;
    }
    return PlantsCollection.findOne(id);
  }, [id]);

  const [editData, setEditData] = useState<Partial<Plant>>();

  useEffect(() => {
    setEditData(Plant);
  }, [Plant]);

  const onSave = useCallback(() => {
    console.log(editData, Plant);
    if (Plant?._id != undefined) {
      PlantsCollection.update(Plant._id, { $set: editData });
      onClose();
      return;
    }

    if (isValidPlant(editData)) {
      PlantsCollection.insert(editData as Plant);
      onClose();
    }
  }, [editData, Plant]);

  const title = useMemo(() => `${Plant?._id === undefined ? 'Add' : 'Edit'} Plant`, [Plant]);
  const action = useMemo(() => (Plant?._id === undefined ? 'Create' : 'Save'), [Plant]);

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
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Name" value={editData?.name} onChange={(name) => update({ name })} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} variant="contained">
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
