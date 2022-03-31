/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Theme,
  Typography,
  Drawer,
  List,
  ListItem,
  SxProps,
  ListItemAvatar,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { isNullish } from '../../utility/null.util';

interface DefaultDrawerInlineSelectProps<T> extends BaseDrawerInlineSelectProps<T> {
  defaultValue: T;
}

interface NoDefaultDrawerInlineSelectProps<T> extends BaseDrawerInlineSelectProps<T> {
  noValueLabel: string;
}

interface BaseDrawerInlineSelectProps<T> {
  label: string;
  value: T | undefined;
  options: T[];
  onChange: (value: T) => void;
  render: (value: T | undefined) =>
    | {
        primary?: string;
        secondary?: string;
        icon?: React.ReactNode;
        avatar?: React.ReactNode;
        chip?: React.ReactNode;
      }
    | undefined;
  sx?: SxProps<Theme> | undefined;
}

type DrawerInlineSelectProps<T> = DefaultDrawerInlineSelectProps<T> | NoDefaultDrawerInlineSelectProps<T>;

function hasDefault<T>(props: DrawerInlineSelectProps<T>): props is DefaultDrawerInlineSelectProps<T> {
  return 'defaultValue' in props;
}

const DrawerInlineSelect = <T extends string | number | object>(props: DrawerInlineSelectProps<T>) => {
  const { label, value, options, onChange, render, sx } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(
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

  const onClickHandler = useCallback(
    (newValue: T) => {
      onChange(newValue);
      toggleDrawer(false);
    },
    [onChange, toggleDrawer]
  );

  const renderListItem = useCallback(
    (input: T | undefined, key: string, listType: 'value' | 'options') => {
      let result = render(input);
      if (
        isNullish(result) ||
        (listType === 'options' &&
          (input === value || (hasDefault(props) && props.defaultValue === input && isNullish(value))))
      ) {
        if (listType === 'options') {
          return null;
        }

        if (!hasDefault(props)) {
          const { noValueLabel } = props;
          return (
            <ListItem button key={key}>
              <ListItemText primary={noValueLabel} />
            </ListItem>
          );
        }

        const { defaultValue } = props;
        result = render(defaultValue);
        if (isNullish(result)) {
          return null;
        }
      }

      let clickHandler: (() => void) | undefined;
      if (input !== value && input !== undefined) {
        clickHandler = () => onClickHandler(input);
      }

      return (
        <ListItem button key={key} onClick={clickHandler}>
          {result.avatar ? <ListItemAvatar sx={{ display: 'flex' }}>{result.avatar}</ListItemAvatar> : null}
          {result.icon ? <ListItemIcon>{result.icon}</ListItemIcon> : null}
          {result.primary ? <ListItemText primary={result.primary} secondary={result.secondary} /> : null}
          {result.chip ? result.chip : null}
        </ListItem>
      );
    },
    [props, onClickHandler, render, value]
  );

  const valueRenderResult = useMemo(() => renderListItem(value, 'value', 'value'), [renderListItem, value]);
  const optionsRenderResult = useMemo(
    () => options?.map((option, index) => renderListItem(option, `option-${index}`, 'options')),
    [options, renderListItem]
  );

  return (
    <>
      <Box sx={{ ...sx }} onClick={toggleDrawer(true)}>
        <Typography variant="subtitle1" component="div" color="GrayText">
          {label}
        </Typography>
        <Typography variant="body1" component="div" sx={{ ml: -2, mr: -2 }}>
          {valueRenderResult}
        </Typography>
      </Box>
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 'auto' }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>{optionsRenderResult}</List>
        </Box>
      </Drawer>
    </>
  );
};

export default DrawerInlineSelect;
