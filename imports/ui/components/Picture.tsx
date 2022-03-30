import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Image = styled('img')({ objectFit: 'cover', width: 230, height: 230 });

interface PictureProps {
  picture: string;
  alt: string;
  onDelete: () => void;
}

const Picture = ({ picture, alt, onDelete }: PictureProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Image src={picture} alt={alt} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label="delete"
            color="error"
            size="small"
            sx={{ ml: 1 }}
            onClick={handleOnDelete}
            title="Delete picture"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-loot-table-component-dialog-title"
        aria-describedby="deleting-loot-table-component-dialog-description"
      >
        <DialogTitle id="deleting-loot-table-component-dialog-title">Delete picture</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-loot-table-component-dialog-description">
            Are you sure you want to delete this picture?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleOnDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Picture;
