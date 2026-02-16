import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PictureData, ContainerSlotIdentifier, Container, PlantInstance, Plant, Comment } from '../interface';
import { useSmallScreen } from '../utility/mediaQuery.util';
import { useUpdateCreatePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import { useUpdatePlant } from '../plants/usePlants';
import PictureUpload from './PictureUpload';
import PictureView from './PictureView';
import FullPictureView from './FullPictureView';

interface PicturesViewProps {
  data?: PlantInstance | Plant;
  alt: string;
  location?: ContainerSlotIdentifier | null;
  container?: Container;
}

function isPlantInstance(data?: PlantInstance | Plant): data is PlantInstance {
  return !!data && 'plant' in data;
}

const PicturesView = ({ data, alt, location, container }: PicturesViewProps) => {
  const isSmallScreen = useSmallScreen();

  const [fullViewImageId, setFullViewImageId] = useState<string | null>(null);
  const updateCreatePlantInstance = useUpdateCreatePlantInstance(
    isPlantInstance(data) ? data : undefined,
    location,
    container
  );
  const updatePlant = useUpdatePlant();

  const onPlantInstanceChange = useCallback(
    (newData: { pictures?: PictureData[]; comments?: Comment[] }) => {
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

  const addPicture = useCallback(
    (picture: Omit<PictureData, 'id'>) => {
      const oldPictures = data?.pictures ?? [];
      onPlantInstanceChange({
        pictures: [
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
        ]
      });
    },
    [data?.pictures, onPlantInstanceChange]
  );

  const removePicture = useCallback(
    (pictureIndex: number) => {
      const newPictures = [...(data?.pictures ?? [])];
      const picture = newPictures[pictureIndex];

      let imageInUse = false;
      data?.comments?.forEach((comment) => {
        if (new RegExp(`\\[[iI][mM][gG][ ]*${picture.id}\\]`).test(comment.text)) {
          imageInUse = true;
        }
      });

      if (imageInUse) {
        picture.deleted = true;
      } else {
        newPictures.splice(pictureIndex, 1);
      }

      onPlantInstanceChange({ pictures: newPictures });
    },
    [data?.pictures, data?.comments, onPlantInstanceChange]
  );

  const onSetDefault = useCallback(
    (picture: PictureData) => {
      const newPictures = [...(data?.pictures ?? [])];
      newPictures.sort(function (x, y) {
        if (x === picture) {
          return -1;
        }

        return y === picture ? 1 : 0;
      });
      onPlantInstanceChange({ pictures: newPictures });
    },
    [data?.pictures, onPlantInstanceChange]
  );

  const onFullViewImageClose = useCallback(() => {
    setFullViewImageId(null);
  }, []);

  const onFullViewImageOpen = useCallback((pictureId: string) => {
    setFullViewImageId(pictureId);
  }, []);

  return (
    <>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{
          display: 'flex',
          flexGrow: 1,
          mt: 1,
          alignItems: 'center',
          justifyContent: isSmallScreen ? 'space-between' : undefined
        }}
        color="GrayText"
      >
        Pictures
        <PictureUpload id="pictures-view-upload" onChange={addPicture} />
      </Typography>
      <Box sx={{ display: 'inline-grid', gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }}>
        {data?.pictures?.map((picture, pictureIndex) => {
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
