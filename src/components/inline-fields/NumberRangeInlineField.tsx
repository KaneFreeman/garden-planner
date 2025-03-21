import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NumberTextField from '../NumberTextField';

interface NumberRangeInlineFieldProps {
  label: React.ReactNode;
  value: [number | undefined, number | undefined] | undefined;
  onChange(value: [number | undefined, number | undefined] | undefined): void;
  wholeNumber?: boolean;
  min?: number;
  max?: number;
}

const NumberRangeInlineField = ({ label, value, onChange, wholeNumber, min, max }: NumberRangeInlineFieldProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<[number | undefined, number | undefined] | undefined>(value);

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

  const handleOnChange = useCallback(
    (index: 0 | 1) => (newValue: number) => {
      const newInternalValue: [number | undefined, number | undefined] = [...(internalValue ?? [undefined, undefined])];
      newInternalValue[index] = newValue;
      setInternalValue(newInternalValue);
    },
    [internalValue]
  );

  return (
    <Box onClick={open ? undefined : handleOpen}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
        color="GrayText"
      >
        {label}
      </Typography>
      {open ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NumberTextField
            autoFocus
            value={internalValue?.[0]}
            onChange={handleOnChange(0)}
            onKeyDown={onKeyDown}
            sx={{ mt: 0, mb: 0 }}
            variant="outlined"
            wholeNumber={wholeNumber}
            min={min}
            max={max}
            inputProps={{ sx: { height: 40, boxSizing: 'border-box' } }}
          />
          <Box>-</Box>
          <NumberTextField
            value={internalValue?.[1]}
            onChange={handleOnChange(1)}
            onKeyDown={onKeyDown}
            sx={{ mt: 0, mb: 0 }}
            variant="outlined"
            wholeNumber={wholeNumber}
            min={min}
            max={max}
            inputProps={{ sx: { height: 40, boxSizing: 'border-box' } }}
          />
          <IconButton onClick={handleClose(false)} color="error">
            <CloseIcon />
          </IconButton>
          <IconButton onClick={onSave} color="success">
            <CheckIcon />
          </IconButton>
        </Box>
      ) : (
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, height: 40, display: 'flex', alignItems: 'center', ml: -2, mr: -2, mt: 0 }}
        >
          <ListItemButton key="dateInlineField-display" onClick={open ? undefined : handleOpen} sx={{ height: 40 }}>
            {value?.[0]}
            {value?.[1] ? <Box>&nbsp;-&nbsp;{value[1]}</Box> : null}
          </ListItemButton>
        </Typography>
      )}
    </Box>
  );
};

export default NumberRangeInlineField;
