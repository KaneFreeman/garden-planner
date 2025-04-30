import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import CommentsView from '../components/comments/CommentsView';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import { PlantInstance } from '../interface';
import PicturesView from '../pictures/PicturesView';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlant } from '../plants/usePlants';
import { isNullish } from '../utility/null.util';
import { getPlantTitle } from '../utility/plant.util';
import PlantInstanceHistoryView from './PlantInstanceHistoryView';

interface PlantInstanceDialogProps {
  open: boolean;
  plantInstance: PlantInstance | undefined | null;
  onClose: () => void;
}

const PlantInstanceDialog = ({ open, plantInstance, onClose }: PlantInstanceDialogProps) => {
  const plant = usePlant(plantInstance?.plant);

  if (isNullish(plantInstance) || !plant) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {getPlantTitle(plant)}
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <SimpleInlineField
          label="Plant"
          value={
            <ListItemButton component="a" href={`/plant/${plant._id}`} sx={{ gap: 0 }}>
              <ListItemAvatar sx={{ display: 'flex' }}>
                <PlantAvatar plant={plant} />
              </ListItemAvatar>
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {getPlantTitle(plant)}
              </Box>
            </ListItemButton>
          }
        />
        <SimpleInlineField label="Started From" value={plantInstance.startedFrom} />
        <PlantInstanceHistoryView plantInstance={plantInstance} />
        <PicturesView data={plantInstance} alt={getPlantTitle(plant)} />
        <CommentsView id={`plant-${plantInstance._id}`} data={plantInstance} alt={getPlantTitle(plant)} />
      </DialogContent>
    </Dialog>
  );
};

export default PlantInstanceDialog;
