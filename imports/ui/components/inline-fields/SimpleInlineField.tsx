import React from 'react';
import { Typography } from '@mui/material';

interface SimpleInlineFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

const SimpleInlineField = ({ label, value }: SimpleInlineFieldProps) => {
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
        sx={{ mt: 1, flexGrow: 1, minHeight: 32, display: 'flex', alignItems: 'center' }}
      >
        {value}
      </Typography>
    </>
  );
};

export default SimpleInlineField;
