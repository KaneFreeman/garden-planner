import Box from '@mui/material/Box';
import { FC } from 'react';

const Logo: FC = () => {
  return <Box component="img" src="/favicon512.png" sx={{ width: '100%', maxWidth: '200px' }} />;
};

export default Logo;
