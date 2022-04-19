import { ReactNode, useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { SxProps, Theme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import './Select.css';

export interface NotRequiredSelectProps<T> extends BaseSelectProps<T> {
  onChange?: (value: T | undefined) => void;
  required?: false;
}

export interface RequiredSelectProps<T> extends BaseSelectProps<T> {
  onChange?: (value: T) => void;
  required: true;
}

interface Label {
  primary: string;
  secondary?: string;
  icon?: ReactNode;
}

interface BaseSelectProps<T> {
  label: string;
  value: T | undefined;
  options: {
    label: Label | string;
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
        onChange(event.target.value === '' ? (undefined as unknown as T) : (event.target.value as T));
      }
    },
    [onChange]
  );

  const renderLabel = useCallback((rawLabel: Label | string) => {
    if (typeof rawLabel === 'string') {
      return rawLabel;
    }

    const { primary, secondary, icon } = rawLabel;
    return (
      <>
        {icon ? <ListItemIcon classes={{ root: 'list-item-icon-root' }}>{icon}</ListItemIcon> : null}
        <ListItemText
          classes={{
            root: 'list-item-text-root',
            primary: 'list-item-text-primary',
            secondary: 'list-item-text-secondary'
          }}
          primary={<Box className="list-item-text-primary-wrapper">{primary}</Box>}
          secondary={secondary}
        />
      </>
    );
  }, []);

  const renderedOptions = useMemo(
    () =>
      options?.map((option, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <MenuItem key={`menu-item-${index}`} value={option.value}>
          {option.emphasize === true ? <em>{renderLabel(option.label)}</em> : renderLabel(option.label)}
        </MenuItem>
      )),
    [options, renderLabel]
  );

  return (
    <FormControl
      fullWidth
      disabled={disabled || options.length === 0}
      error={Boolean(error || (required && dirty && !value) || (value && !valueInOptions))}
      required={required}
      sx={sx}
      classes={{ root: 'form-control-root' }}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        id={id}
        value={value ?? ''}
        label={label}
        onChange={handleOnChange}
        classes={{
          select: 'select-root'
        }}
      >
        {!required ? (
          <MenuItem key="NONE" value="">
            <em>None</em>
          </MenuItem>
        ) : null}
        {value && !valueInOptions ? (
          <MenuItem key={value} value={value}>
            <em>{value}</em>
          </MenuItem>
        ) : null}
        {renderedOptions}
      </MuiSelect>
      {helperText ? <Box>{helperText}</Box> : null}
    </FormControl>
  );
};

export default Select;
