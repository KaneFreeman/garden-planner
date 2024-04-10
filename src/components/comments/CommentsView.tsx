import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import { PictureData, Comment, PlantInstance, ContainerSlotIdentifier, Container, Plant } from '../../interface';
import useSmallScreen from '../../utility/smallScreen.util';
import { useUpdateCreatePlantInstance } from '../../plant-instances/hooks/usePlantInstances';
import { useUpdatePlant } from '../../plants/usePlants';
import CommentBox from './CommentBox';
import CommentView from './CommentView';

interface CommentsViewProps {
  id: string;
  data?: PlantInstance | Plant;
  location?: ContainerSlotIdentifier | null;
  container?: Container;
  alt: string;
}

function isPlantInstance(data?: PlantInstance | Plant): data is PlantInstance {
  return !!data && 'plant' in data;
}

const CommentsView = ({ id, data, location, container, alt }: CommentsViewProps) => {
  const isSmallScreen = useSmallScreen();

  const [showCommentBox, setShowCommentBox] = useState(false);

  const updateCreatePlantInstance = useUpdateCreatePlantInstance(
    isPlantInstance(data) ? data : undefined,
    location,
    container
  );
  const updatePlant = useUpdatePlant();

  const onPlantInstanceChange = useCallback(
    (newData: Partial<PlantInstance>) => {
      if (isPlantInstance(data)) {
        updateCreatePlantInstance({
          ...data,
          ...newData
        });
      } else if (data) {
        updatePlant({
          ...data,
          ...newData
        });
      }
    },
    [data, updateCreatePlantInstance, updatePlant]
  );

  const addComment = useCallback(
    (comment: Comment) => {
      onPlantInstanceChange({ comments: [...(data?.comments ?? []), comment] });
    },
    [onPlantInstanceChange, data?.comments]
  );

  const removeComment = useCallback(
    (commentIndex: number) => {
      const newComments = [...(data?.comments ?? [])];
      newComments.splice(commentIndex, 1);

      const newPictures = data?.pictures?.reduce((cleanedUpPictures, picture) => {
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

      onPlantInstanceChange({ comments: newComments, pictures: newPictures });
    },
    [data?.comments, data?.pictures, onPlantInstanceChange]
  );

  return (
    <>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{
          flexGrow: 1,
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: isSmallScreen ? 'space-between' : undefined
        }}
        color="GrayText"
      >
        Comments
        <IconButton color="primary" onClick={() => setShowCommentBox(true)} disabled={showCommentBox}>
          <AddIcon />
        </IconButton>
      </Typography>
      {data?.comments?.map((comment, commentIndex) => (
        <CommentView
          id={id}
          pictures={data?.pictures}
          alt={alt}
          key={`commentView-${id}-${commentIndex}`}
          comment={comment}
          index={commentIndex}
          onDelete={removeComment}
        />
      ))}
      <CommentBox open={showCommentBox} onComment={addComment} onClose={() => setShowCommentBox(false)} />
      {!showCommentBox ? (
        <Button onClick={() => setShowCommentBox(true)} sx={{ mb: 1 }}>
          <CommentIcon />
          <Box sx={{ ml: 0.5 }}>Comment</Box>
        </Button>
      ) : null}
    </>
  );
};

export default CommentsView;
