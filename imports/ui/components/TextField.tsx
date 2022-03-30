import React, { KeyboardEventHandler, useCallback, useMemo, useState } from 'react';
import { TextField as MuiTextField, InputBaseComponentProps, SxProps, Theme } from '@mui/material';
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
}

const TextField = (props: TextFieldProps) => {
  const { onChange, error, ...otherProps } = props;
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
      margin="dense"
      variant="standard"
      onChange={handleOnChange}
      fullWidth
      error={error || (otherProps.required && dirty && isEmpty)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    />
  );
};

export default TextField;
