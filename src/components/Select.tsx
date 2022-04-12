import { ReactNode, useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { SxProps, Theme } from '@mui/material/styles';

export interface NotRequiredSelectProps<T> extends BaseSelectProps<T> {
  onChange?: (value: T | undefined) => void;
  required?: false;
}

export interface RequiredSelectProps<T> extends BaseSelectProps<T> {
  onChange?: (value: T) => void;
  required: true;
}

interface BaseSelectProps<T> {
  label: string;
  value: T | undefined;
  options: {
    label: ReactNode;
    value: T | undefined;
    emphasize?: boolean;
  }[];
  error?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

type SelectProps<T> = RequiredSelectProps<T> | NotRequiredSelectProps<T>;

const Select = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  required = false,
  error = false,
  disabled = false,
  helperText,
  sx
}: SelectProps<T>) => {
  const id = useMemo(() => label.toLowerCase().replace(' ', '_'), [label]);
  const labelId = useMemo(() => `${id}-label`, [id]);
  const valueInOptions = useMemo(() => Boolean(options.find((option) => option.value === value)), [options, value]);

  const [dirty, setDirty] = useState(false);

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string | NonNullable<T>>) => {
      setDirty(true);
      if (onChange) {
        onChange(event.target.value as T);
      }
    },
    [onChange]
  );

  return (
    <FormControl
      fullWidth
      disabled={disabled || options.length === 0}
      error={Boolean(error || (required && dirty && !value) || (value && !valueInOptions))}
      required={required}
      sx={sx}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect labelId={labelId} id={id} value={value ?? ''} label={label} onChange={handleOnChange}>
        {!required ? (
          <MenuItem key="NONE" value={undefined}>
            <em>None</em>
          </MenuItem>
        ) : null}
        {value && !valueInOptions ? (
          <MenuItem key={value} value={value}>
            <em>{value}</em>
          </MenuItem>
        ) : null}
        {options?.map((option, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem key={`menu-item-${index}`} value={option.value}>
            {option.emphasize === true ? <em>{option.label}</em> : option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText ? <Box>{helperText}</Box> : null}
    </FormControl>
  );
};

export default Select;
