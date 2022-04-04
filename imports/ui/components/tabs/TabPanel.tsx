import React from 'react';
import { Box } from '@mui/material';

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
}

export default function TabPanel({ children, value, index, ariaLabel }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${ariaLabel}-tabpanel-${index}`}
      aria-labelledby={`${ariaLabel}-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}
