import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, ContainersCollection } from '../../api/Containers';
import NumberTextField from '../components/NumberTextField';
import TextField from '../components/TextField';

interface ContainerModalProperties {
  id?: string | undefined;
  open: boolean;
  onClose: () => void;
}

function isValidContainer(container: Partial<Container> | undefined): container is Container {
  return container?.name !== undefined && container?.rows !== undefined && container?.columns !== undefined;
}

const ContainerModal = ({ id, open, onClose }: ContainerModalProperties) => {
  const container = useTracker(() => {
    if (!id) {
      return undefined;
    }
    return ContainersCollection.findOne(id);
  }, [id]);

  const [editData, setEditData] = useState<Partial<Container>>();

  useEffect(() => {
    setEditData(container);
  }, [container]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (container?._id !== undefined) {
        ContainersCollection.update(container._id, { $set: editData });
        onClose();
        return;
      }

      if (isValidContainer(editData)) {
        ContainersCollection.insert(editData);
        onClose();
      }
    },
    [container?._id, editData, onClose]
  );

  const title = useMemo(() => `${container?._id === undefined ? 'Add' : 'Edit'} Container`, [container]);
  const action = useMemo(() => (container?._id === undefined ? 'Create' : 'Save'), [container]);

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form name="container-modal-form" onSubmit={onSubmit} noValidate>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Name" value={editData?.name} onChange={(name) => update({ name })} required />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <NumberTextField label="Rows" value={editData?.rows} onChange={(rows) => update({ rows })} required />
            <NumberTextField
              label="Columns"
              value={editData?.columns}
              onChange={(columns) => update({ columns })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {action}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContainerModal;
