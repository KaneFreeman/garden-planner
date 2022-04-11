import { useMemo } from 'react';
import { Select as MuiSelect, Box, FormControl, InputLabel, MenuItem, SxProps, Theme } from '@mui/material';

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
    label: string;
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

  return (
    <FormControl
      fullWidth
      disabled={disabled || options.length === 0}
      error={Boolean(error || (required && !value) || (value && !valueInOptions))}
      required={required}
      sx={sx}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        id={id}
        value={value ?? ''}
        label={label}
        onChange={onChange ? (event) => onChange(event.target.value as T) : undefined}
      >
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
        {options?.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.emphasize === true ? <em>{option.label}</em> : option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText ? <Box>{helperText}</Box> : null}
    </FormControl>
  );
};

export default Select;
