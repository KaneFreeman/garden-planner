import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NumberTextField from '../NumberTextField';

interface NumberInlineFieldProps {
  label: React.ReactNode;
  value: number | undefined;
  onChange(value: number | undefined): void;
  wholeNumber?: boolean;
  min?: number;
  max?: number;
}

const NumberInlineField = ({ label, value, onChange, wholeNumber, min, max }: NumberInlineFieldProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<number | undefined>(value);

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
        <NumberTextField
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
          wholeNumber={wholeNumber}
          min={min}
          max={max}
        />
      ) : (
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, height: 32, display: 'flex', alignItems: 'center', ml: -2, mr: -2, mt: 0.5 }}
        >
          <ListItem button key="numberInlineField-display" onClick={open ? undefined : handleOpen}>
            {value}
          </ListItem>
        </Typography>
      )}
    </Box>
  );
};

export default NumberInlineField;
