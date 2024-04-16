import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TextField from '../components/TextField';
import { Garden } from '../interface';
import './GardenModal.css';
import { useRemoveGarden, useUpdateGarden } from './useGardens';

interface GardenModalProperties {
  garden: Garden;
  open: boolean;
  onClose: () => void;
}

function isValidGarden(garden: Partial<Garden> | null): garden is Omit<Garden, 'id'> {
  return garden?.name !== undefined;
}

const EditGardenModal = ({ garden, open, onClose }: GardenModalProperties) => {
  const navigate = useNavigate();

  const [editData, setEditData] = useState<Garden>({ ...garden });

  useEffect(() => {
    setEditData({ ...garden });
  }, [garden]);

  const updateGarden = useUpdateGarden();
  const removeGarden = useRemoveGarden();

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSave = useCallback(async () => {
    if (isValidGarden(editData)) {
      const editedGarden = await updateGarden(editData);
      setEditData({ ...(editedGarden ?? garden) });
      handleOnClose();
    }
  }, [editData, garden, handleOnClose, updateGarden]);

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

  const [isDeleting, setIsDeleting] = useState(false);
  const handleOnDelete = useCallback(() => {
    setIsDeleting(true);
  }, []);
  const handleOnDeleteConfirm = useCallback(() => {
    removeGarden(garden._id);
    navigate('/');
    setIsDeleting(false);
  }, [garden._id, navigate, removeGarden]);
  const handleOnDeleteClose = useCallback(() => setIsDeleting(false), []);

  return (
    <>
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
        <DialogTitle>Edit Garden</DialogTitle>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, gap: 1 }}>
            <Box>
              <Button onClick={handleOnDelete} color="error">
                Delete
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleOnClose}>Cancel</Button>
              <Button onClick={onSave} color="success">
                Save
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
      {isDeleting ? (
        <Dialog
          key="delete-dialog"
          open
          onClose={handleOnDeleteClose}
          aria-labelledby="deleting-garden-title"
          aria-describedby="deleting-garden-description"
        >
          <DialogTitle id="deleting-garden-title">Delete garden</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-garden-description">
              Are you sure you want to delete garden {`'${garden.name}'`}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnDeleteClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={handleOnDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default EditGardenModal;
