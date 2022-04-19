import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import NumberTextField from '../components/NumberTextField';
import TextField from '../components/TextField';
import { Container, CONTAINER_TYPES } from '../interface';
import { useAddContainer } from './useContainers';
import Select from '../components/Select';

interface ContainerModalProperties {
  open: boolean;
  onClose: () => void;
}

function isValidContainer(container: Partial<Container> | null): container is Omit<Container, 'id'> {
  return (
    container?.name !== undefined &&
    container?.type !== undefined &&
    container?.rows !== undefined &&
    container?.columns !== undefined
  );
}

const ContainerModal = ({ open, onClose }: ContainerModalProperties) => {
  const [editData, setEditData] = useState<Partial<Container> | null>(null);

  const addContainer = useAddContainer();

  const handleOnClose = useCallback(() => {
    setEditData(null);
    onClose();
  }, [onClose]);

  const onSave = useCallback(() => {
    if (isValidContainer(editData)) {
      addContainer(editData);
      handleOnClose();
    }
  }, [addContainer, editData, handleOnClose]);

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
              label: {
                primary: entry,
                icon: entry === 'Inside' ? <HomeIcon titleAccess="Inside" /> : <ParkIcon titleAccess="Outside" />
              },
              value: entry
            }))}
            sx={{ mt: 1.5, mb: 1 }}
            required
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <NumberTextField
              label="Rows"
              value={editData?.rows}
              onChange={(rows) => update({ rows })}
              required
              variant="outlined"
            />
            <NumberTextField
              label="Columns"
              value={editData?.columns}
              onChange={(columns) => update({ columns })}
              required
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContainerModal;
