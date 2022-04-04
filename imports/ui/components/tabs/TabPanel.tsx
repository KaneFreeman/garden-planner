import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

export function a11yProps(ariaLabel: string, index: number) {
  return {
    id: `${ariaLabel}-tab-${index}`,
    'aria-controls': `${ariaLabel}-tabpanel-${index}`
  };
}

interface TabPanelProps {
  children: JSX.Element;
  value: number;
  index: number;
  ariaLabel: string;
  sx?: SxProps<Theme> | undefined;
}

export default function TabPanel({ children, value, index, ariaLabel, sx }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`${ariaLabel}-tabpanel-${index}`}
      aria-labelledby={`${ariaLabel}-tab-${index}`}
      sx={sx}
    >
      {value === index && children}
    </Box>
  );
}
