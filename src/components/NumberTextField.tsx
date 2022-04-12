import React, { KeyboardEventHandler, useEffect, useMemo, useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { InputProps } from '@mui/material/Input';
import { InputBaseComponentProps } from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';

interface NumberTextFieldProps {
  id?: string;
  label?: string;
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
  variant?: 'outlined' | 'filled' | 'standard';
  autoFocus?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const NumberTextField = ({
  id,
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
  endAdornment,
  variant = 'standard',
  autoFocus = false,
  onKeyDown
}: NumberTextFieldProps) => {
  const finalId = useMemo(() => {
    if (id !== 'undefined') {
      return id;
    }

    if (label !== undefined) {
      return label.toLowerCase().replace(' ', '_');
    }

    return undefined;
  }, [id, label]);

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
      id={finalId}
      label={label}
      margin="dense"
      variant={variant}
      type="number"
      value={internalValue}
      onChange={(event) => {
        const stringValue = event.target.value;
        setInternalValue(stringValue);
        setDirty(true);

        const newValue = Number(stringValue);
        if (!Number.isNaN(newValue) && (!required || Boolean(stringValue))) {
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
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
    />
  );
};

export default NumberTextField;
