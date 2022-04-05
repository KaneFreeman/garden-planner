/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Tab as MuiTab, Theme, Box, SxProps } from '@mui/material';
import { a11yProps } from './TabPanel';

export interface TabProps {
  label: React.ReactNode;
  index: number;
  sx?: SxProps<Theme> | undefined;

  // Tab pass through props
  indicator?: unknown;
  selected?: boolean;
  selectionFollowsFocus?: unknown;
  onChange?: any;
  textColor?: unknown;
  value?: unknown;
  tabIndex?: number;

  disabled: boolean;

  ariaLabel: string;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const Tab = ({ label, index, disabled, ariaLabel, sx = {}, ...otherProps }: TabProps) => {
  return (
    <MuiTab
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>{label}</Box>
        </Box>
      }
      sx={sx}
      disabled={disabled}
      {...otherProps}
      {...a11yProps(ariaLabel, index)}
    />
  );
};

export default Tab;
