/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, CircularProgress, IconButton, Link, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import { useTracker } from 'meteor/react-meteor-data';
import { Comment, ContainersCollection, Slot } from '../../api/Containers';
import CommentBox from '../components/CommentBox';
import CommentView from '../components/CommentView';
import PicturesView from '../components/pictures/PicturesView';
import { Picture } from '../../api/Common';

const ContainerSlot = () => {
  const navigate = useNavigate();

  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const [showCommentBox, setShowCommentBox] = useState(false);

  const container = useTracker(() => ContainersCollection.findOne(id), [id]);

  console.log(id, index, container);

  const updateSlot = useCallback(
    (data: Partial<Slot>) => {
      if (id && container) {
        const newSlot: Slot = { ...(container.slots?.[indexNumber] ?? {}), ...data };

        const newSlots = { ...(container.slots ?? {}) };
        newSlots[indexNumber] = newSlot;

        ContainersCollection.update(id, { $set: { slots: newSlots } });
      }
    },
    [container, id, indexNumber]
  );

  const updatePictures = useCallback(
    (pictures: Picture[]) => {
      if (id && container) {
        updateSlot({ pictures });
      }
    },
    [id, container, updateSlot]
  );

  const addComment = useCallback(
    (comment: Comment) => {
      if (id && container) {
        updateSlot({ comments: [...(container.slots?.[indexNumber]?.comments ?? []), comment] });
      }
    },
    [id, container, updateSlot, indexNumber]
  );

  const removeComment = useCallback(
    (commentIndex: number) => {
      if (id && container) {
        const newComments = [...(container.slots?.[indexNumber]?.comments ?? [])];
        newComments.splice(commentIndex, 1);
        updateSlot({ comments: newComments });
      }
    },
    [id, container, indexNumber, updateSlot]
  );

  const slot = useMemo(() => container?.slots?.[indexNumber] ?? {}, [container?.slots, indexNumber]);

  const column = useMemo(() => Math.floor((indexNumber + 1) / (container?.rows ?? 1)), [container?.rows, indexNumber]);

  const row = useMemo(() => indexNumber % ((container?.rows ?? 1) * column), [container?.rows, indexNumber, column]);

  const title = useMemo(() => `Row ${row + 1}, Column ${column + 1}`, [column, row]);

  if (!container) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link underline="hover" color="inherit" onClick={() => navigate(`/container/${container._id}`)}>
          <Typography variant="h6">{container.name}</Typography>
        </Link>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
      </Breadcrumbs>
      <PicturesView pictures={slot.pictures} alt={title} onChange={updatePictures} />
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
      >
        Comments
        <IconButton onClick={() => setShowCommentBox(true)} disabled={showCommentBox}>
          <AddIcon />
        </IconButton>
      </Typography>
      {slot.comments?.map((comment, commentIndex) => (
        <CommentView
          slot={slot}
          slotTitle={title}
          key={`comment-${commentIndex}`}
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
    </Box>
  );
};

export default ContainerSlot;
