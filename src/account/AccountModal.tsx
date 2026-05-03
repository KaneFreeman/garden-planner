import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import React, { useCallback, useEffect, useState } from 'react';
import TextField from '../components/TextField';
import { UserDTO } from '../interface';
import './AccountModal.css';
import { useUpdateUser } from './useUser';

interface AccountModalProperties {
  user: UserDTO;
  open: boolean;
  onClose: () => void;
}

const AccountModal = ({ user, open, onClose }: AccountModalProperties) => {
  const [editData, setEditData] = useState<UserDTO>({ ...user });

  useEffect(() => {
    setEditData({ ...user });
  }, [user]);

  const updateUser = useUpdateUser();

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSave = useCallback(async () => {
    const editedUser = await updateUser(editData);
    if (typeof editedUser === 'string') {
      return;
    }

    setEditData({ ...(editedUser ?? user) });
    handleOnClose();
  }, [editData, user, handleOnClose, updateUser]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const update = useCallback(
    (data: Partial<UserDTO>) => {
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
        root: 'userModal-root',
        paper: 'userModal-paper'
      }}
      open={open}
      onClose={handleOnClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>My Account</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField required label="Email" type="email" disabled value={user.email} autoComplete="email" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              autoComplete="given-name"
              required
              label="First Name"
              autoFocus
              value={editData.firstName}
              onChange={(firstName) => update({ firstName })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              label="Last Name"
              autoComplete="family-name"
              value={editData.lastName}
              onChange={(lastName) => update({ lastName })}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              required
              label="Zip Code"
              autoComplete="family-name"
              value={editData.zipCode}
              inputProps={{ pattern: '[0-9]{5}' }}
              onChange={(zipCode) => update({ zipCode })}
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={editData.summaryEmail}
                  onChange={(event) => update({ summaryEmail: event.target.checked })}
                />
              }
              label="Receive daily summary email"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountModal;
