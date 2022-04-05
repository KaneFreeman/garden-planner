/* eslint-disable react/no-array-index-key */
import { useCallback, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import { PictureData, Comment } from '../../interface';
import CommentBox from './CommentBox';
import CommentView from './CommentView';

interface CommentsViewProps {
  id: string;
  comments?: Comment[];
  pictures?: PictureData[];
  alt: string;
  onChange: (comments: Comment[], pictures?: PictureData[]) => void;
}

const CommentsView = ({ id, comments, pictures, alt, onChange }: CommentsViewProps) => {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const addComment = useCallback(
    (comment: Comment) => {
      onChange([...(comments ?? []), comment]);
    },
    [onChange, comments]
  );

  const removeComment = useCallback(
    (commentIndex: number) => {
      const newComments = [...(comments ?? [])];
      newComments.splice(commentIndex, 1);

      const newPictures = pictures?.reduce((cleanedUpPictures, picture) => {
        if (!picture.deleted) {
          cleanedUpPictures.push(picture);
          return cleanedUpPictures;
        }

        let imageInUse = false;
        newComments?.forEach((comment) => {
          if (new RegExp(`\\[[iI][mM][gG][ ]*${picture.id}\\]`).test(comment.text)) {
            imageInUse = true;
          }
        });

        if (imageInUse) {
          cleanedUpPictures.push(picture);
        }
        return cleanedUpPictures;
      }, [] as PictureData[]);

      onChange(newComments, newPictures);
    },
    [comments, onChange, pictures]
  );

  return (
    <>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
        color="GrayText"
      >
        Comments
        <IconButton onClick={() => setShowCommentBox(true)} disabled={showCommentBox}>
          <AddIcon />
        </IconButton>
      </Typography>
      {comments?.map((comment, commentIndex) => (
        <CommentView
          id={id}
          pictures={pictures}
          alt={alt}
          key={`commentView-${id}-${commentIndex}`}
          comment={comment}
          index={commentIndex}
          onDelete={removeComment}
        />
      ))}
      <CommentBox open={showCommentBox} onComment={addComment} onClose={() => setShowCommentBox(false)} />
      {!showCommentBox ? (
        <Button onClick={() => setShowCommentBox(true)}>
          <CommentIcon />
          <Box sx={{ ml: 0.5 }}>Comment</Box>
        </Button>
      ) : null}
    </>
  );
};

export default CommentsView;
