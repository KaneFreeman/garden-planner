/* eslint-disable react/no-array-index-key */
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';
import CommentsView from '../components/comments/CommentsView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import NumberRangeInlineField from '../components/inline-fields/NumberRangeInlineField';
import TextInlineField from '../components/inline-fields/TextInlineField';
import PlantSlotsView from '../containers/plants/PlantSlotsView';
import { MATURITY_FROM_SEED, MATURITY_FROM_TYPES, MaturityFromType, PLANT_TYPES, Plant, PlantType } from '../interface';
import PicturesView from '../pictures/PicturesView';
import useSmallScreen from '../utility/smallScreen.util';
import PlantDataView from './PlantDataView';
import { usePlant, useRemovePlant, useUpdatePlant } from './usePlants';

const PlantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isSmallScreen = useSmallScreen();

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

  const [moreMenuAnchorElement, setMoreMenuAnchorElement] = React.useState<null | HTMLElement>(null);
  const moreMenuOpen = useMemo(() => Boolean(moreMenuAnchorElement), [moreMenuAnchorElement]);
  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorElement(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorElement(null);
  };

  useEffect(() => {
    handleMoreMenuClose();
  }, [isSmallScreen]);

  const onRetireChange = useCallback(() => {
    handleUpdatePlant({ retired: !plant?.retired });
    handleMoreMenuClose();
  }, [handleUpdatePlant, plant?.retired]);

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

  const onUrlClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  }, []);

  const renderPlantType = useCallback((value: PlantType | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: value
    };
  }, []);

  const renderMaturityFromType = useCallback((value: MaturityFromType | null | undefined) => {
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
                  <Box key="small-screen-actions" sx={{ display: 'flex' }}>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={moreMenuOpen ? 'long-menu' : undefined}
                      aria-expanded={moreMenuOpen ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleMoreMenuClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={moreMenuAnchorElement}
                      open={moreMenuOpen}
                      onClose={handleMoreMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button'
                      }}
                    >
                      <MenuItem onClick={onRetireChange}>
                        <ListItemIcon>
                          {plant.retired === true ? (
                            <LockOpenIcon color="success" fontSize="small" />
                          ) : (
                            <LockIcon color="warning" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <Typography color={plant.retired === true ? 'success.main' : 'warning.main'}>
                          {plant.retired === true ? 'Unretire' : 'Retire'}
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={handleOnDelete}>
                        <ListItemIcon>
                          <DeleteIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <Typography color="error.main">Delete</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      aria-label={plant.retired === true ? 'unretire' : 'retire'}
                      color={plant.retired === true ? 'success' : 'warning'}
                      onClick={onRetireChange}
                      title={plant.retired === true ? 'Unretire' : 'Retire'}
                    >
                      {plant.retired === true ? (
                        <LockOpenIcon sx={{ mr: 1 }} color="success" fontSize="small" />
                      ) : (
                        <LockIcon sx={{ mr: 1 }} color="warning" fontSize="small" />
                      )}
                      {plant.retired === true ? 'Unretire' : 'Retire'}
                    </Button>
                    <Button
                      variant="outlined"
                      aria-label="delete plant"
                      color="error"
                      onClick={handleOnDelete}
                      title="Delete plant"
                    >
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
              <Link href={plant.url} underline="none" onClick={onUrlClick} target="_blank" rel="noopener">
                <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                  {value}
                </Box>
              </Link>
            ) : null
          }
        />
        <NumberRangeInlineField
          label="Days to Germinate"
          value={plant.daysToGerminate}
          onChange={(daysToGerminate) => handleUpdatePlant({ daysToGerminate })}
        />
        <NumberRangeInlineField
          label="Days to Maturity"
          value={plant.daysToMaturity}
          onChange={(daysToMaturity) => handleUpdatePlant({ daysToMaturity })}
        />
        <DrawerInlineSelect
          label="Maturity From"
          value={plant.maturityFrom ?? MATURITY_FROM_SEED}
          noValueLabel="No plant type"
          options={MATURITY_FROM_TYPES}
          onChange={(maturityFrom) => handleUpdatePlant({ maturityFrom })}
          renderer={renderMaturityFromType}
          sx={{ mt: 1 }}
        />
        <PlantSlotsView plantId={id} />
        <PlantDataView type={plant.type} />
        <PicturesView data={plant} alt={plant.name} />
        <CommentsView id={`plant-${id}`} data={plant} alt={plant.name} />
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
