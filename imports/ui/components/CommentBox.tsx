/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Comment } from '../../api/Containers';
import { isNotEmpty } from '../utility/string.util';
import TextField from './TextField';

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
    <Box sx={{ pl: 1, pr: 1, width: '100%', boxSizing: 'border-box' }}>
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
        <Button onClick={onClose} color="inherit" autoFocus>
          Cancel
        </Button>
        <Button onClick={onCommentHandler} color="primary">
          Save
        </Button>
      </Box>
    </Box>
  ) : null;
};

export default CommentBox;
