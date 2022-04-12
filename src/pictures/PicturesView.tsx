/* eslint-disable react/no-array-index-key */
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PictureUpload from './PictureUpload';
import PictureView from './PictureView';
import { PictureData, Comment } from '../interface';
import FullPictureView from './FullPictureView';

interface PicturesViewProps {
  pictures?: PictureData[];
  comments?: Comment[];
  alt: string;
  onChange: (pictures: PictureData[]) => void;
}

const PicturesView = ({ pictures, comments, alt, onChange }: PicturesViewProps) => {
  const [fullViewImageId, setFullViewImageId] = useState<string | null>(null);

  const addPicture = useCallback(
    (picture: Omit<PictureData, 'id'>) => {
      const oldPictures = pictures ?? [];
      onChange([
        ...oldPictures,
        {
          ...picture,
          id: oldPictures.reduce((lastId, oldPicture) => {
            if (oldPicture.id >= lastId) {
              return oldPicture.id + 1;
            }

            return lastId;
          }, 0)
        }
      ]);
    },
    [pictures, onChange]
  );

  const removePicture = useCallback(
    (pictureIndex: number) => {
      const newPictures = [...(pictures ?? [])];
      const picture = newPictures[pictureIndex];

      let imageInUse = false;
      comments?.forEach((comment) => {
        if (new RegExp(`\\[[iI][mM][gG][ ]*${picture.id}\\]`).test(comment.text)) {
          imageInUse = true;
        }
      });

      if (imageInUse) {
        picture.deleted = true;
      } else {
        newPictures.splice(pictureIndex, 1);
      }

      onChange(newPictures);
    },
    [pictures, comments, onChange]
  );

  const onSetDefault = useCallback(
    (picture: PictureData) => {
      const newPictures = [...(pictures ?? [])];
      newPictures.sort(function (x, y) {
        if (x === picture) {
          return -1;
        }

        return y === picture ? 1 : 0;
      });
      onChange(newPictures);
    },
    [pictures, onChange]
  );

  const onFullViewImageClose = useCallback(() => {
    setFullViewImageId(null);
  }, []);

  const onFullViewImageOpen = useCallback((pictureId: string) => {
    setFullViewImageId(pictureId);
  }, []);

  return (
    <>
      <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, mt: 2 }} color="GrayText">
        Pictures
        <PictureUpload id="pictures-view-upload" onChange={addPicture} />
      </Typography>
      <Box sx={{ display: 'inline-grid', gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }}>
        {pictures?.map((picture, pictureIndex) => {
          if (picture.deleted) {
            return null;
          }

          return (
            <PictureView
              key={`picture-${picture.id}`}
              picture={picture.thumbnail}
              alt={alt}
              onDelete={() => removePicture(pictureIndex)}
              onSetDefault={() => onSetDefault(picture)}
              size="small"
              onClick={() => onFullViewImageOpen(picture.pictureId)}
            />
          );
        })}
      </Box>
      <FullPictureView pictureId={fullViewImageId} alt={alt} onClose={onFullViewImageClose} />
    </>
  );
};

export default PicturesView;
