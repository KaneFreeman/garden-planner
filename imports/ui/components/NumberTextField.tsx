import React, { useEffect, useMemo, useState } from 'react';
import {
  TextField as MuiTextField,
  InputBaseComponentProps,
  SxProps,
  Theme,
  InputProps,
  InputAdornment
} from '@mui/material';

interface NumberTextFieldProps {
  label: string;
  value: number | undefined;
  onChange?: (value: number) => void;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  wholeNumber?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
  min?: number;
  max?: number;
  step?: number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const NumberTextField = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  disabled = false,
  wholeNumber = false,
  helperText,
  sx,
  min,
  max,
  step,
  startAdornment,
  endAdornment
}: NumberTextFieldProps) => {
  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);

  const [internalValue, setInternalValue] = useState<string>('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const internalNumberValue = Number(internalValue);
    if (internalNumberValue === value) {
      return;
    }
    setInternalValue(value !== undefined ? `${value}` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const inputProps: Partial<InputProps> = useMemo(() => {
    const allInputProps: Partial<InputProps> = {};
    const baseInputProps: InputBaseComponentProps = {};

    if (min !== undefined) {
      baseInputProps.min = min;
    }

    if (max !== undefined) {
      baseInputProps.max = max;
    }

    if (step !== undefined) {
      baseInputProps.step = step;
    }

    if (startAdornment !== undefined) {
      allInputProps.startAdornment = <InputAdornment position="start">{startAdornment}</InputAdornment>;
    }

    if (endAdornment !== undefined) {
      allInputProps.endAdornment = <InputAdornment position="end">{endAdornment}</InputAdornment>;
    }

    allInputProps.inputProps = baseInputProps;
    return allInputProps;
  }, [endAdornment, max, min, startAdornment, step]);

  return (
    <MuiTextField
      id={id}
      label={label}
      margin="dense"
      variant="standard"
      type="number"
      value={internalValue}
      onChange={(event) => {
        const stringValue = event.target.value;
        setInternalValue(stringValue);
        setDirty(true);

        const newValue = Number(stringValue);
        if (!Number.isNaN(newValue) && Boolean(stringValue)) {
          onChange?.(newValue);
        }
      }}
      onBlur={(event) => {
        const stringValue = event.target.value;

        const newValue = Number(stringValue);
        if (!Number.isNaN(newValue) && Boolean(stringValue)) {
          setInternalValue(`${newValue}`);
        }
      }}
      required={required}
      InputProps={inputProps}
      fullWidth
      error={Boolean(
        error ||
          (required && dirty && (value === undefined || internalValue === '')) ||
          Number.isNaN(value) ||
          (value !== undefined &&
            ((wholeNumber && value % 1 !== 0) ||
              (min !== undefined && value < min) ||
              (max !== undefined && value > max)))
      )}
      disabled={disabled}
      helperText={helperText}
      sx={sx}
    />
  );
};

export default NumberTextField;
