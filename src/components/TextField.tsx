import { InputProps } from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import { InputBaseComponentProps } from '@mui/material/InputBase';
import MuiTextField from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';
import React, { HTMLInputTypeAttribute, KeyboardEventHandler, useCallback, useMemo, useState } from 'react';
import { isNotEmpty } from '../utility/string.util';

interface TextFieldProps {
  label?: string;
  value?: string | undefined;
  defaultValue?: string | undefined;
  inputProps?: InputBaseComponentProps | undefined;
  inputRef?: React.RefObject<HTMLInputElement>;
  onChange?: (value: string) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  autoComplete?: string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
}

const TextField = (props: TextFieldProps) => {
  const { onChange, error, variant = 'standard', autoFocus, startAdornment, endAdornment, ...otherProps } = props;
  const id = useMemo(() => otherProps.label?.toLowerCase().replace(' ', '_'), [otherProps.label]);

  const [isEmpty, setIsEmpty] = useState(
    !otherProps.value &&
      !isNotEmpty(otherProps.value) &&
      !otherProps.defaultValue &&
      !isNotEmpty(otherProps.defaultValue)
  );

  const [dirty, setDirty] = useState(false);

  if ('value' in otherProps || !('defaultValue' in otherProps)) {
    otherProps.value = otherProps.value ?? '';
  }

  const inputProps: Partial<InputProps> = useMemo(() => {
    const allInputProps: Partial<InputProps> = {};
    const baseInputProps: InputBaseComponentProps = {};

    if (startAdornment !== undefined) {
      allInputProps.startAdornment = <InputAdornment position="start">{startAdornment}</InputAdornment>;
    }

    if (endAdornment !== undefined) {
      allInputProps.endAdornment = <InputAdornment position="end">{endAdornment}</InputAdornment>;
    }

    allInputProps.inputProps = baseInputProps;
    return allInputProps;
  }, [endAdornment, startAdornment]);

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setIsEmpty(!isNotEmpty(value));
      setDirty(true);

      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <MuiTextField
      id={id}
      name={id}
      margin="dense"
      variant={variant}
      onChange={handleOnChange}
      fullWidth
      error={error || (otherProps.required && dirty && isEmpty)}
      autoFocus={autoFocus}
      InputProps={inputProps}
      {...otherProps}
    />
  );
};

export default TextField;
