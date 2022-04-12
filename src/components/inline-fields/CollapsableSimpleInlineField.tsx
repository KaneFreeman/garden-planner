import { memo, useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';

interface CollapsableSimpleInlineFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
  startCollapsed?: boolean;
}

const CollapsableSimpleInlineField = memo(
  ({ label, value, startCollapsed = false }: CollapsableSimpleInlineFieldProps) => {
    const [collapsed, setCollapsed] = useState(startCollapsed);

    const toggleCollapse = useCallback(() => {
      setCollapsed(!collapsed);
    }, [collapsed]);

    return (
      <Box onClick={toggleCollapse}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
          color="GrayText"
        >
          {label}
          <Box
            sx={{
              transition: 'transform 333ms ease-out',
              transform: `rotate(${collapsed ? '-90deg' : '0deg'});`,
              width: 24,
              height: 24,
              ml: 0.5
            }}
          >
            <KeyboardArrowDownIcon />
          </Box>
        </Typography>
        <Collapse in={!collapsed}>
          <Typography
            variant="body1"
            component="div"
            sx={{ mt: 1, flexGrow: 1, minHeight: 32, display: 'flex', alignItems: 'center' }}
          >
            {value}
          </Typography>
        </Collapse>
      </Box>
    );
  }
);

export default CollapsableSimpleInlineField;
