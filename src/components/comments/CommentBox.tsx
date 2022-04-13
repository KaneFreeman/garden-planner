/* eslint-disable react/no-array-index-key */
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Comment } from '../../interface';
import { isNotEmpty } from '../../utility/string.util';
import TextField from '../TextField';

interface CommentBoxProps {
  open: boolean;
  comment?: string;
  onComment(comment: Comment): void;
  onClose(): void;
}

const CommentBox = ({ open, comment, onComment, onClose }: CommentBoxProps) => {
  const [internalComment, setInternalComment] = useState<string>(comment ?? '');

  const onCommentHandler = useCallback(() => {
    if (isNotEmpty(internalComment)) {
      onComment({ text: internalComment, date: new Date() });
      onClose();
      setInternalComment('');
    }
  }, [internalComment, onClose, onComment]);

  return open ? (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <TextField
        label="Add comment"
        multiline
        rows={4}
        value={internalComment}
        onChange={setInternalComment}
        variant="outlined"
        autoFocus
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button sx={{ mb: 1 }} onClick={onClose} color="inherit" autoFocus>
          Cancel
        </Button>
        <Button sx={{ mb: 1 }} onClick={onCommentHandler} color="primary">
          Save
        </Button>
      </Box>
    </Box>
  ) : null;
};

export default CommentBox;
