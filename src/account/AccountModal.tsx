import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import React, { useCallback, useState } from 'react';
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
  const [editData, setEditData] = useState<UserDTO | null>(null);
  const currentEditData = editData ?? user;

  const updateUser = useUpdateUser();

  const handleOnClose = useCallback(() => {
    setEditData(null);
    onClose();
  }, [onClose]);

  const onSave = useCallback(async () => {
    const editedUser = await updateUser(currentEditData);
    if (typeof editedUser === 'string') {
      return;
    }

    setEditData(null);
    handleOnClose();
  }, [currentEditData, handleOnClose, updateUser]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const update = useCallback(
    (data: Partial<UserDTO>) => {
      setEditData((value) => ({
        ...(value ?? user),
        ...data
      }));
    },
    [user]
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
              value={currentEditData.firstName}
              onChange={(firstName) => update({ firstName })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              label="Last Name"
              autoComplete="family-name"
              value={currentEditData.lastName}
              onChange={(lastName) => update({ lastName })}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              required
              label="Zip Code"
              autoComplete="family-name"
              value={currentEditData.zipCode}
              inputProps={{ pattern: '[0-9]{5}' }}
              onChange={(zipCode) => update({ zipCode })}
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentEditData.summaryEmail}
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
