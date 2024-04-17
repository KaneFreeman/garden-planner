import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SxProps, Theme } from '@mui/material/styles';

export interface LoadingProps {
  sx?: SxProps<Theme>;
}

const Loading = ({ sx }: LoadingProps) => {
  return (
    <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
      <CircularProgress />
    </Box>
  );
};

export default Loading;
