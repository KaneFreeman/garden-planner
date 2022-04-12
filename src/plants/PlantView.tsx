/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import PicturesView from '../pictures/PicturesView';
import TextInlineField from '../components/inline-fields/TextInlineField';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantDataView from './PlantDataView';
import CommentsView from '../components/comments/CommentsView';
import NumberRangeInlineField from '../components/inline-fields/NumberRangeInlineField';
import { Plant, Comment, PictureData, PlantType, PLANT_TYPES } from '../interface';
import { useRemovePlant, usePlant, useUpdatePlant } from './usePlants';

const PlantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backPath = searchParams.get('backPath');
  const backLabel = searchParams.get('backLabel');

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

  const renderPlantType = useCallback((value: PlantType | undefined) => {
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
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, width: '100%' }}>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          {backPath && backLabel ? (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <Link underline="hover" color="inherit" onClick={() => navigate(backPath)} sx={{ cursor: 'pointer' }}>
              <Typography
                variant="h6"
                sx={{
                  height: 52,
                  alignItems: 'center',
                  display: 'flex',
                  marginTop: 0.5
                }}
              >
                {backLabel}
              </Typography>
            </Link>
          ) : null}
          <Typography variant="h6" color="text.primary">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextInlineField valueVariant="h6" value={plant.name} onChange={(name) => handleUpdatePlant({ name })} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleOnDelete}
                  title="Delete picture"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Typography>
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
                {value}
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
