import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import { SxProps, Theme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
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
  value: string | undefined;
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
  onChange(value: string | undefined): void;
  renderer?: (value: string | undefined) => React.ReactNode;
  noMargin?: boolean;
  noPadding?: boolean;
  sx?: SxProps<Theme> | undefined;
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
  sx
}: TextInlineFieldProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

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
    (save: boolean) => () => {
      setOpen(false);
      if (internalValue !== value) {
        if (save) {
          onChange(internalValue);
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

  return (
    <Box onClick={open ? undefined : handleOpen} sx={sx}>
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
          variant="outlined"
        />
      ) : (
        <Typography
          variant={valueVariant}
          component="div"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ...(noMargin ? {} : { ml: -2, mr: -2, mt: 0.5 }) }}
          color={valueActive ? 'text.primary' : undefined}
        >
          <ListItemButton
            key="dateInlineField-display"
            onClick={open ? undefined : handleOpen}
            sx={{ ...(noPadding ? { p: 0 } : {}) }}
          >
            {displayValue}
          </ListItemButton>
        </Typography>
      )}
    </Box>
  );
};

export default TextInlineField;
