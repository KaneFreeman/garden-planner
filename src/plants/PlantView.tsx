/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import PicturesView from '../pictures/PicturesView';
import TextInlineField from '../components/inline-fields/TextInlineField';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantDataView from './PlantDataView';
import CommentsView from '../components/comments/CommentsView';
import NumberRangeInlineField from '../components/inline-fields/NumberRangeInlineField';
import { Plant, Comment, PictureData, PlantType, PLANT_TYPES } from '../interface';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';
import { useRemovePlant, usePlant, useUpdatePlant } from './usePlants';

const PlantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const plant = usePlant(id);
  const updatePlant = useUpdatePlant();
  const removePlant = useRemovePlant();

  const handleUpdatePlant = useCallback(
    (data: Partial<Plant>) => {
      if (id && plant) {
        updatePlant({
          ...plant,
          ...data
        });
      }
    },
    [id, plant, updatePlant]
  );

  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (id) {
      removePlant(id);
      navigate('/plants');
    }
  }, [removePlant, id, navigate]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const updatePictures = useCallback((pictures: PictureData[]) => handleUpdatePlant({ pictures }), [handleUpdatePlant]);

  const updateComments = useCallback(
    (comments: Comment[], pictures?: PictureData[]) => {
      if (pictures) {
        handleUpdatePlant({ comments, pictures });
        return;
      }
      handleUpdatePlant({ comments });
    },
    [handleUpdatePlant]
  );

  const onUrlClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      if (plant?.url !== undefined) {
        window.location.href = plant.url;
      }
    },
    [plant]
  );

  const renderPlantType = useCallback((value: PlantType | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: value
    };
  }, []);

  const sortedPlantTypes = useMemo(() => {
    const plantTypes = [...PLANT_TYPES];
    plantTypes.sort((a, b) => a.localeCompare(b));
    return plantTypes;
  }, []);

  if (!plant || plant?._id !== id) {
    return <Loading />;
  }

  return (
    <>
      <Box sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
        <Breadcrumbs
          trail={[
            {
              to: `/plants`,
              label: 'Plants'
            }
          ]}
        >
          {{
            current: (
              <TextInlineField
                valueVariant="h6"
                value={plant.name}
                valueActive
                onChange={(name) => handleUpdatePlant({ name })}
                noMargin
                noPadding
                sx={{
                  minWidth: 0
                }}
              />
            ),
            actions: (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isSmallScreen ? (
                  <Box sx={{ display: 'flex' }}>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      size="small"
                      onClick={handleOnDelete}
                      title="Delete container"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex' }}>
                    <Button variant="outlined" color="error" onClick={handleOnDelete} title="Delete plant">
                      <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>
            )
          }}
        </Breadcrumbs>
        <DrawerInlineSelect
          label="Type"
          value={plant.type}
          noValueLabel="No plant type"
          options={sortedPlantTypes}
          onChange={(type) => handleUpdatePlant({ type })}
          renderer={renderPlantType}
          sx={{ mt: 1 }}
        />
        <TextInlineField
          label="Url"
          value={plant.url}
          onChange={(url) => handleUpdatePlant({ url })}
          renderer={(value) =>
            value ? (
              <Button variant="text" onClick={onUrlClick} sx={{ ml: -1 }}>
                <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                  {value}
                </Box>
              </Button>
            ) : null
          }
        />
        <NumberRangeInlineField
          label="Days to Maturity"
          value={plant.daysToMaturity}
          onChange={(daysToMaturity) => handleUpdatePlant({ daysToMaturity })}
        />
        <PlantDataView type={plant.type} />
        <PicturesView pictures={plant.pictures} comments={plant.comments} alt={plant.name} onChange={updatePictures} />
        <CommentsView
          id={`plant-${id}`}
          comments={plant.comments}
          alt={plant.name}
          pictures={plant.pictures}
          onChange={updateComments}
        />
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-plant-title"
        aria-describedby="deleting-plant-description"
      >
        <DialogTitle id="deleting-plant-title">Delete plant</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-plant-description">
            Are you sure you want to delete this plant?
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

export default PlantView;
