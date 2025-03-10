import React, { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, SxProps, Theme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { grey } from '@mui/material/colors';
import { isNullish } from '../../utility/null.util';
import './DrawerInlineSelect.css';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800]
}));

const drawerBleeding = 22;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)'
}));

interface DefaultDrawerInlineSelectProps<T> extends BaseDrawerInlineSelectProps<T> {
  defaultValue: T;
  onChange: (value: T) => void;
  required: true;
}

interface NoDefaultDrawerInlineSelectProps<T> extends BaseDrawerInlineSelectProps<T> {
  noValueLabel: string;
  onChange: (value: T | null) => void;
  required?: false;
}

interface BaseDrawerInlineSelectProps<T> {
  label: string;
  value: T | null | undefined;
  options: T[];
  renderer: (
    value: T | null | undefined,
    type: 'value' | 'options'
  ) =>
    | {
        primary?: string;
        secondary?: string;
        icon?: React.ReactNode;
        avatar?: React.ReactNode;
        raw?: React.ReactNode;
      }
    | undefined;
  sx?: SxProps<Theme> | undefined;
}

type DrawerInlineSelectProps<T> = DefaultDrawerInlineSelectProps<T> | NoDefaultDrawerInlineSelectProps<T>;

function hasDefault<T>(props: DrawerInlineSelectProps<T>): props is DefaultDrawerInlineSelectProps<T> {
  return 'defaultValue' in props;
}

const DrawerInlineSelect = <T extends string | number | object>(props: DrawerInlineSelectProps<T>) => {
  const { label, value, options, renderer, sx, required } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(open);
    },
    []
  );

  const openDrawer = useMemo(() => handleDrawerToggle(true), [handleDrawerToggle]);

  const closeDrawer = useMemo(() => handleDrawerToggle(false), [handleDrawerToggle]);

  const toggleDrawer = useMemo(() => handleDrawerToggle(!drawerOpen), [drawerOpen, handleDrawerToggle]);

  const onClickHandler = useCallback(
    (newValue: T | null) => {
      if (newValue !== value) {
        if (hasDefault(props)) {
          props.onChange(newValue ?? props.defaultValue);
        } else {
          props.onChange(newValue);
        }
      }
      setDrawerOpen(false);
    },
    [props, value]
  );

  const renderListItem = useCallback(
    (input: T | null | undefined, key: string, listType: 'value' | 'options') => {
      let result = renderer(input, listType);
      if (isNullish(result)) {
        if (listType === 'options') {
          return null;
        }

        if (!hasDefault(props)) {
          const { noValueLabel } = props;
          return (
            <ListItemButton key={key}>
              <ListItemText primary={noValueLabel} />
            </ListItemButton>
          );
        }

        const { defaultValue } = props;
        result = renderer(defaultValue, listType);
        if (isNullish(result)) {
          return null;
        }
      }

      let clickHandler: (() => void) | undefined;
      if (input !== value && input !== undefined) {
        clickHandler = () => onClickHandler(input);
      }

      return (
        <ListItemButton
          key={key}
          onClick={clickHandler}
          selected={
            listType === 'options' &&
            (value === input || (hasDefault(props) && input === props.defaultValue && isNullish(value)))
          }
          sx={{ height: 40 }}
        >
          {result.avatar ? <ListItemAvatar sx={{ display: 'flex' }}>{result.avatar}</ListItemAvatar> : null}
          {result.icon ? <ListItemIcon>{result.icon}</ListItemIcon> : null}
          {result.primary ? <ListItemText primary={result.primary} secondary={result.secondary} /> : null}
          {result.raw ? result.raw : null}
        </ListItemButton>
      );
    },
    [props, onClickHandler, renderer, value]
  );

  const valueRenderResult = useMemo(() => renderListItem(value, 'value', 'value'), [renderListItem, value]);
  const optionsRenderResult = useMemo(
    () => options?.map((option, index) => renderListItem(option, `option-${index}`, 'options')),
    [options, renderListItem]
  );

  return (
    <>
      <Box sx={{ ...sx }} onClick={openDrawer}>
        <Typography variant="subtitle1" component="div" color="GrayText">
          {label}
        </Typography>
        <Typography variant="body1" component="div" sx={{ ml: -2, mr: -2 }}>
          {valueRenderResult}
        </Typography>
      </Box>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawer}
        classes={{
          root: 'drawer-inline-select-root',
          paper: 'drawer-inline-select-paper'
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            height: drawerBleeding
          }}
          onClick={toggleDrawer}
        >
          <Puller />
        </StyledBox>
        <Box
          sx={{ width: 'auto', overflowY: 'auto' }}
          role="presentation"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
        >
          <List>
            {!required ? (
              <ListItemButton
                key="option-none"
                onClick={() => onClickHandler(null)}
                selected={value === null || value === undefined}
              >
                <ListItemText primary="None" />
              </ListItemButton>
            ) : null}
            {optionsRenderResult}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default DrawerInlineSelect;
