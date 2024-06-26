import { ReactNode } from 'react';
import MuiTab from '@mui/material/Tab';
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export interface TabProps {
  label: ReactNode;
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
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const Tab = ({ label, index, disabled, sx = {}, ...otherProps }: TabProps) => {
  return (
    <MuiTab
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>{label}</Box>
        </Box>
      }
      sx={sx}
      disabled={disabled}
      id={`tab-${index + 1}`}
      aria-controls={`panel-${index + 1}`}
      {...otherProps}
    />
  );
};

export default Tab;
