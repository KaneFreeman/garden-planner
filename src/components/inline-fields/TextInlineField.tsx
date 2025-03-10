import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TextField from '../TextField';

interface TextInlineFieldProps {
  label?: React.ReactNode;
  labelVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit';
  value: string;
  valueActive?: boolean;
  valueVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit';
  onChange(value: string): boolean | Promise<boolean> | void | Promise<void>;
  renderer?: (value: string) => React.ReactNode;
  noMargin?: boolean;
  noPadding?: boolean;
  sx?: SxProps<Theme> | undefined;
  editSx?: SxProps<Theme> | undefined;
  readOnly?: boolean;
}

const TextInlineField = ({
  label,
  labelVariant = 'subtitle1',
  value,
  valueVariant = 'body1',
  valueActive = false,
  onChange,
  renderer,
  noMargin = false,
  noPadding = false,
  sx,
  editSx,
  readOnly = false
}: TextInlineFieldProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(
    (save: boolean) => async () => {
      setOpen(false);
      if (internalValue !== value) {
        if (save) {
          if ((await onChange(internalValue)) === false) {
            setInternalValue(value);
          }
        } else {
          setInternalValue(value);
        }
      }
    },
    [internalValue, onChange, value]
  );

  const onSave = useMemo(() => handleClose(true), [handleClose]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        onSave();
      }
    },
    [onSave]
  );

  const displayValue = useMemo(() => {
    if (renderer) {
      return renderer(value);
    }

    return (
      <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={value}>
        {value}
      </Box>
    );
  }, [renderer, value]);

  const finalSx: SxProps<Theme> = useMemo(() => {
    return { ...(sx ?? {}), ...(open && editSx ? editSx : {}) };
  }, [editSx, open, sx]);

  return (
    <Box onClick={readOnly || open ? undefined : handleOpen} sx={finalSx}>
      {label ? (
        <Typography
          variant={labelVariant}
          component="div"
          sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
          color="GrayText"
        >
          {label}
        </Typography>
      ) : null}
      {open ? (
        <TextField
          autoFocus
          value={internalValue}
          onChange={setInternalValue}
          endAdornment={
            <Box>
              <IconButton onClick={handleClose(false)} color="error">
                <CloseIcon />
              </IconButton>
              <IconButton onClick={onSave} color="success">
                <CheckIcon />
              </IconButton>
            </Box>
          }
          onKeyDown={onKeyDown}
          sx={{ mt: 0, mb: 0 }}
          inputProps={{ sx: { height: 40, boxSizing: 'border-box' } }}
          variant="outlined"
        />
      ) : (
        <Typography
          variant={valueVariant}
          component="div"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ...(noMargin ? {} : { ml: -2, mr: -2, mt: 0 }) }}
          color={valueActive ? 'text.primary' : undefined}
        >
          {readOnly ? (
            <ListItem key="textInlineField-display" sx={{ ...(noPadding ? { p: 0 } : {}) }}>
              {displayValue}
            </ListItem>
          ) : (
            <ListItemButton
              key="textInlineField-display-button"
              onClick={open ? undefined : handleOpen}
              sx={{ ...(noPadding ? { p: 0 } : {}), height: 40 }}
            >
              {displayValue}
            </ListItemButton>
          )}
        </Typography>
      )}
    </Box>
  );
};

export default TextInlineField;
