import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { PlantInstance } from '../interface';
import { usePlant } from '../plants/usePlants';
import { isNullish } from '../utility/null.util';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import PlantAvatar from '../plants/PlantAvatar';
import PlantInstanceHistoryView from './PlantInstanceHistoryView';

interface PlantInstanceDialogProps {
  open: boolean;
  plantInstance: PlantInstance | undefined | null;
  onClose: () => void;
}

const PlantInstanceDialog = ({ open, plantInstance, onClose }: PlantInstanceDialogProps) => {
  const navigate = useNavigate();

  const plant = usePlant(plantInstance?.plant);

  const onPlantClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (plant) {
        event.stopPropagation();
        navigate(`/plant/${plant._id}`);
      }
    },
    [navigate, plant]
  );

  if (isNullish(plantInstance) || !plant) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {plant.name}
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <SimpleInlineField
          label="Plant"
          value={
            <ListItemButton onClick={onPlantClick} sx={{ gap: 0 }}>
              <ListItemAvatar sx={{ display: 'flex' }}>
                <PlantAvatar plant={plant} />
              </ListItemAvatar>
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {plant.name}
              </Box>
            </ListItemButton>
          }
        />
        <SimpleInlineField label="Started From" value={plantInstance.startedFrom} />
        <SimpleInlineField label="Planted Count" value={plantInstance.plantedCount} />
        <PlantInstanceHistoryView plantInstance={plantInstance} />
      </DialogContent>
    </Dialog>
  );
};

export default PlantInstanceDialog;
