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
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<UserDTO>({ ...user });

  useEffect(() => {
    setEditData({ ...user });
  }, [user]);

  const updateUser = useUpdateUser();

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSave = useCallback(async () => {
    setLoading(true);

    const editedUser = await updateUser(editData);
    setLoading(true);
    if (typeof editedUser === 'string') {
      setLoading(false);
      return;
    }

    setEditData({ ...(editedUser ?? user) });
    setLoading(false);
    handleOnClose();
  }, [editData, user, handleOnClose, updateUser]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>My Account</DialogTitle>
      <DialogContent>
        <form name="user-modal-form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Email"
                type="email"
                disabled
                value={user.email}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                label="First Name"
                autoFocus
                value={editData.firstName}
                onChange={(firstName) => update({ firstName })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Last Name"
                autoComplete="family-name"
                value={editData.lastName}
                onChange={(lastName) => update({ lastName })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="New Password"
                type="password"
                inputProps={{
                  minlength: '8'
                }}
                autoComplete="new-password"
                disabled={loading}
                value={editData.password}
                onChange={(password) => update({ password })}
              />
            </Grid>
            <Grid item xs={12}>
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountModal;
