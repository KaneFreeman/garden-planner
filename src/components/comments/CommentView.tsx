import React, { useCallback, useMemo, useState } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplaceAll from '../../utility/markup.util';
import { PictureData, Comment } from '../../interface';
import PictureView from '../../pictures/PictureView';

interface CommentProps {
  id: string;
  pictures?: PictureData[];
  alt: string;
  comment: Comment;
  index: number;
  onDelete: (index: number) => void;
}

const CommentView = ({ id, pictures, alt, comment, index, onDelete }: CommentProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete(index);
  }, [index, onDelete]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const text = useMemo(() => {
    let formattedText: React.ReactNode[] = [comment.text];

    pictures?.forEach((picture, pictureIndex) => {
      formattedText = ReplaceAll(
        formattedText,
        new RegExp(`\\[[iI][mM][gG][ ]*${picture.id}\\]`),
        <PictureView key={`comment-picture-${pictureIndex}`} picture={picture.thumbnail} alt={alt} />
      );
    });

    return formattedText.map((node, nodeIndex) => {
      if (typeof node !== 'string') {
        return node;
      }

      return <Box key={`comment-text-${nodeIndex}`}>{node}</Box>;
    });
  }, [comment.text, pictures, alt]);

  return (
    <>
      <Box key={`comment-${id}-${index}`} sx={{ pl: 1, pr: 1, boxSizing: 'border-box' }}>
        {index !== 0 ? <Divider sx={{ mb: 1.5 }} /> : null}
        <Box sx={{ display: 'flex', mb: 0.5, width: '100%', boxSizing: 'border-box' }}>
          <Typography
            variant="body2"
            component="div"
            sx={{ minHeight: 30, display: 'flex', alignItems: 'center' }}
            color="GrayText"
          >
            {comment.date.toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              sx={{ ml: 1 }}
              onClick={handleOnDelete}
              title="Delete comment"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mb: 2, width: '100%', boxSizing: 'border-box' }}>
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
            {text}
          </Typography>
        </Box>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-comment-title"
        aria-describedby="deleting-comment-description"
      >
        <DialogTitle id="deleting-comment-title">Delete comment</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-comment-description">
            Are you sure you want to delete this comment?
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

export default CommentView;
