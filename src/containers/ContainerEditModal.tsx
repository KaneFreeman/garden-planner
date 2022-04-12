import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '../components/TextField';
import { Container, CONTAINER_TYPES } from '../interface';
import { useUpdateContainer } from './useContainers';
import Select from '../components/Select';

interface ContainerEditModalProperties {
  open: boolean;
  container: Container;
  onClose: () => void;
}

const ContainerEditModal = ({ open, container, onClose }: ContainerEditModalProperties) => {
  const [editData, setEditData] = useState<Container>(container);

  const updateContainer = useUpdateContainer();

  const handleOnClose = useCallback(() => {
    setEditData(container);
    onClose();
  }, [container, onClose]);

  const onSave = useCallback(() => {
    updateContainer(editData);
    handleOnClose();
  }, [updateContainer, editData, handleOnClose]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const update = useCallback(
    (data: Partial<Container>) => {
      setEditData({
        ...editData,
        ...data
      });
    },
    [editData]
  );

  return (
    <Dialog open={open} onClose={handleOnClose} maxWidth="sm" fullWidth>
      <form name="container-modal-form" onSubmit={onSubmit} noValidate>
        <DialogTitle>Add Container</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Name"
            value={editData?.name}
            onChange={(name) => update({ name })}
            required
            variant="outlined"
          />
          <Select
            label="Type"
            value={editData?.type}
            onChange={(type) => update({ type })}
            options={CONTAINER_TYPES?.map((entry) => ({
              label: entry,
              value: entry
            }))}
            sx={{ mt: 1.5, mb: 1 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContainerEditModal;
