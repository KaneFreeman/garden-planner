/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import { Box, Dialog, Typography } from '@mui/material';
import { Picture } from '../../../api/Common';
import { Comment } from '../../../api/Containers';
import PictureUpload from './PictureUpload';
import PictureView from './PictureView';
import './PicturesView.css';

interface PicturesViewProps {
  pictures?: Picture[];
  comments?: Comment[];
  alt: string;
  onChange: (pictures: Picture[]) => void;
}

const PicturesView = ({ pictures, comments, alt, onChange }: PicturesViewProps) => {
  const [fullViewImage, setFullViewImage] = useState<string | null>(null);

  const addPicture = useCallback(
    (picture: Omit<Picture, 'id'>) => {
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

  const onFullViewImageClose = useCallback(() => {
    setFullViewImage(null);
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
              picture={picture.dataUrl}
              alt={alt}
              onDelete={() => removePicture(pictureIndex)}
              size="small"
              onClick={() => setFullViewImage(picture.dataUrl)}
            />
          );
        })}
      </Box>
      {fullViewImage ? (
        <Dialog
          classes={{
            root: 'picture-full-view',
            paper: 'picture-full-view-paper'
          }}
          onClose={onFullViewImageClose}
          open
        >
          <PictureView
            key="picture-full-view"
            picture={fullViewImage}
            alt={alt}
            size="full"
            onClick={onFullViewImageClose}
          />
        </Dialog>
      ) : null}
    </>
  );
};

export default PicturesView;
