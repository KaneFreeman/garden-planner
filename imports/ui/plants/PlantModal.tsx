/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField as MuiTextField
} from '@mui/material';
import { PictureData } from '../../api/Common';
import { Plant, PlantsCollection, PLANT_TYPES } from '../../api/Plants';
import TextField from '../components/TextField';
import PictureUpload from '../components/pictures/PictureUpload';
import PictureView from '../components/pictures/PictureView';
import './PlantModal.css';

interface PlantModalProperties {
  open: boolean;
  onClose: () => void;
}

function isValidPlant(plant: Partial<Plant> | null): plant is Omit<Plant, 'id'> {
  return plant?.name !== undefined;
}

const PlantModal = ({ open, onClose }: PlantModalProperties) => {
  const [editData, setEditData] = useState<Partial<Plant> | null>(null);

  const handleOnClose = useCallback(() => {
    setEditData(null);
    onClose();
  }, [onClose]);

  const onSave = useCallback(() => {
    if (isValidPlant(editData)) {
      PlantsCollection.insert(editData);
      handleOnClose();
    }
  }, [editData, handleOnClose]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const update = useCallback(
    (data: Partial<Plant>) => {
      setEditData({
        ...editData,
        ...data
      });
    },
    [editData]
  );

  const addPicture = useCallback(
    (picture: Omit<PictureData, 'id'>) => {
      const oldPictures = editData?.pictures ?? [];
      update({
        pictures: [
          ...oldPictures,
          {
            ...picture,
            id: oldPictures.reduce((lastId, oldPicture) => {
              if (oldPicture.id >= lastId) {
                return oldPicture.id + 1;
              }

              return lastId;
            }, 0)
          }
        ]
      });
    },
    [editData?.pictures, update]
  );

  const removePicture = useCallback(
    (pictureIndex: number) => {
      const newPictures = [...(editData?.pictures ?? [])];
      newPictures.splice(pictureIndex, 1);
      update({ pictures: newPictures });
    },
    [editData?.pictures, update]
  );

  return (
    <Dialog
      classes={{
        root: 'plantModal-root',
        paper: 'plantModal-paper'
      }}
      open={open}
      onClose={handleOnClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Plant</DialogTitle>
      <DialogContent>
        <form name="plant-modal-form" onSubmit={onSubmit} noValidate>
          <TextField
            autoFocus
            label="Name"
            value={editData?.name}
            onChange={(name) => update({ name })}
            required
            variant="outlined"
          />
          <Autocomplete
            disablePortal
            id="plant-type"
            options={PLANT_TYPES}
            fullWidth
            renderInput={(params) => <MuiTextField {...params} label="Type" />}
            sx={{ mt: 1, mb: 1 }}
            onChange={(_, newValue) => update({ type: newValue ?? undefined })}
          />
          <PictureUpload id="new-plant-picture" onChange={addPicture} />
          {editData?.pictures?.map((picture, pictureIndex) => (
            <PictureView
              key={`picture-${picture.id}`}
              picture={picture.thumbnail}
              alt={editData?.name ?? 'New plant'}
              onDelete={() => removePicture(pictureIndex)}
              size="small"
            />
          ))}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlantModal;
