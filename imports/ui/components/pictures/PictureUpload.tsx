/* eslint-disable promise/catch-or-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback } from 'react';
import { IconButton, styled } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { Picture } from '../../../api/Common';
import generateThumbnail from '../../utility/thumbnail.util';

const Input = styled('input')({
  display: 'none'
});

interface PictureUploadProps {
  id: string;
  onChange(picture: Omit<Picture, 'id'>): void;
}

const PictureUpload = ({ id, onChange }: PictureUploadProps) => {
  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        function () {
          const dataUrl = reader.result;
          if (typeof dataUrl === 'string') {
            // eslint-disable-next-line promise/always-return
            generateThumbnail(dataUrl, { width: 80, height: 80 }).then((thumbnail) => {
              onChange({
                date: new Date(),
                dataUrl,
                thumbnail
              });
            });
          }
          // eslint-disable-next-line no-param-reassign
          event.target.value = '';
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  return (
    <>
      <label htmlFor={`camera-${id}`}>
        <Input
          accept="image/*"
          id={`camera-${id}`}
          type="file"
          capture="environment"
          onChange={onChangeHandler}
          onClick={(event) => event.stopPropagation()}
        />
        <IconButton color="primary" aria-label="upload picture" component="span">
          <PhotoCamera />
        </IconButton>
      </label>
      <label htmlFor={`upload-${id}`}>
        <Input
          accept="image/*"
          id={`upload-${id}`}
          type="file"
          onChange={onChangeHandler}
          onClick={(event) => event.stopPropagation()}
        />
        <IconButton color="primary" aria-label="upload picture" component="span">
          <InsertPhotoIcon />
        </IconButton>
      </label>
    </>
  );
};

export default PictureUpload;
