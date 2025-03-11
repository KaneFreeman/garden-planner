import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React, { useCallback, useState } from 'react';
import Select from '../components/Select';
import TextField from '../components/TextField';
import { Container, CONTAINER_TYPES, STARTED_FROM_TYPES } from '../interface';
import { useUpdateContainer } from './hooks/useContainers';

interface ContainerEditModalProperties {
  open: boolean;
  container: Container;
  onClose: () => void;
}

const ContainerEditModal = ({ open, container, onClose }: ContainerEditModalProperties) => {
  const [editData, setEditData] = useState<Container>(container);

  const updateContainer = useUpdateContainer();

  const handleOnClose = useCallback(() => {
    onClose();
    setEditData(container);
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
        <DialogTitle>Edit Container</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Name"
            value={editData?.name}
            onChange={(name) => update({ name })}
            required
            variant="outlined"
            sx={{ mt: 1.5, mb: 1 }}
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
          <Select
            label="Started From"
            value={editData?.startedFrom}
            onChange={(startedFrom) => update({ startedFrom })}
            options={STARTED_FROM_TYPES?.map((entry) => ({
              label: entry,
              value: entry
            }))}
            sx={{ mt: 1.5, mb: 1 }}
          />
          <MobileDatePicker
            label="Year"
            value={editData?.year ? new Date(editData.year, 0, 1) : null}
            views={['year']}
            onChange={(newYearDate: Date | null) => update({ year: newYearDate?.getFullYear() })}
            slotProps={{
              actionBar: {
                actions: ['clear', 'cancel', 'accept']
              },
              textField: { sx: { mt: 1.5, mb: 1, width: '100%', flexGrow: 1 } }
            }}
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
