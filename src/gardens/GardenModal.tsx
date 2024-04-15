import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useCallback, useState } from 'react';
import TextField from '../components/TextField';
import { Garden } from '../interface';
import './GardenModal.css';
import { useAddGarden } from './useGardens';
import { useAppDispatch } from '../store/hooks';
import { setSelectedGarden } from '../store/slices/gardens';

interface GardenModalProperties {
  open: boolean;
  onClose: () => void;
}

function isValidGarden(garden: Partial<Garden> | null): garden is Omit<Garden, 'id'> {
  return garden?.name !== undefined;
}

const GardenModal = ({ open, onClose }: GardenModalProperties) => {
  const [editData, setEditData] = useState<Partial<Garden> | null>(null);

  const dispatch = useAppDispatch();

  const addGarden = useAddGarden();

  const handleOnClose = useCallback(() => {
    setEditData(null);
    onClose();
  }, [onClose]);

  const onSave = useCallback(async () => {
    if (isValidGarden(editData)) {
      const newGarden = await addGarden(editData);
      if (newGarden) {
        dispatch(setSelectedGarden(newGarden._id));
      }
      handleOnClose();
    }
  }, [addGarden, dispatch, editData, handleOnClose]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const update = useCallback(
    (data: Partial<Garden>) => {
      setEditData({
        ...editData,
        ...data
      });
    },
    [editData]
  );

  return (
    <Dialog
      classes={{
        root: 'gardenModal-root',
        paper: 'gardenModal-paper'
      }}
      open={open}
      onClose={handleOnClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Garden</DialogTitle>
      <DialogContent>
        <form name="garden-modal-form" onSubmit={onSubmit} noValidate>
          <TextField
            autoFocus
            label="Name"
            value={editData?.name}
            onChange={(name) => update({ name })}
            required
            variant="outlined"
          />
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

export default GardenModal;
