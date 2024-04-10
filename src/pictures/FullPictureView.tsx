import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import PictureView from './PictureView';
import { usePicture } from './usePictures';
import './FullPictureView.css';

interface PicturesViewProps {
  pictureId?: string | null;
  alt: string;
  onClose: () => void;
}

const FullPictureView = ({ pictureId, alt, onClose }: PicturesViewProps) => {
  const picture = usePicture(pictureId ?? undefined);

  if (!pictureId) {
    return null;
  }

  return picture?._id === pictureId ? (
    <Dialog
      classes={{
        root: 'picture-full-view',
        paper: 'picture-full-view-paper'
      }}
      onClose={onClose}
      open
    >
      <PictureView key="picture-full-view" picture={picture.dataUrl} alt={alt} size="full" onClick={onClose} />
    </Dialog>
  ) : (
    <>
      <Backdrop open sx={{ zIndex: 1500 }} onClick={onClose} />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1501
        }}
        onClick={onClose}
      >
        <CircularProgress />
      </Box>
    </>
  );
};

export default FullPictureView;
