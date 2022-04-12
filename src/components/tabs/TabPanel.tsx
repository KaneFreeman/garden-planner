import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children: JSX.Element;
  value: number;
  index: number;
  sx?: SxProps<Theme> | undefined;
}

export default function TabPanel({ children, value, index, sx }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`panel-${index + 1}`}
      aria-labelledby={`tab-${index + 1}`}
      sx={sx}
    >
      {value === index && children}
    </Box>
  );
}
