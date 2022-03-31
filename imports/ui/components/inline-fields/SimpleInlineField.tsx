import React from 'react';
import { Typography } from '@mui/material';

interface SimpleFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

const SimpleField = ({ label, value }: SimpleFieldProps) => {
  return (
    <>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
        color="GrayText"
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        component="div"
        sx={{ flexGrow: 1, height: 32, display: 'flex', alignItems: 'center' }}
      >
        {value}
      </Typography>
    </>
  );
};

export default SimpleField;
