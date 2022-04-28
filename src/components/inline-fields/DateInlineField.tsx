/* eslint-disable react/jsx-props-no-spreading */
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import format from 'date-fns/format';
import './DateInlineField.css';

interface DateInlineFieldProps {
  label: React.ReactNode;
  value: Date | undefined;
  onChange?: (value: Date | undefined) => void;
  renderer?: (value: Date | undefined) => ReactNode;
  readOnly?: boolean;
  dateOnly?: boolean;
}

const DateInlineField = memo(
  ({ label, value, onChange, renderer, readOnly = false, dateOnly = false }: DateInlineFieldProps) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<Date | undefined>(value);

    useEffect(() => {
      if (value !== internalValue) {
        setInternalValue(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleOpen = useCallback(() => {
      setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setOpen(false);
      if (internalValue !== value && onChange) {
        onChange(internalValue);
      }
    }, [internalValue, onChange, value]);

    const displayValue = useMemo(() => {
      if (renderer) {
        return renderer(value);
      }

      if (dateOnly) {
        return value ? format(value, 'MMMM d, yyyy') : 'None';
      }

      return value ? format(value, 'MMMM d, yyyy h:mmaaa') : 'None';
    }, [dateOnly, renderer, value]);

    return (
      <Box className="dateInlineField-root">
        <Box onClick={readOnly || open ? undefined : handleOpen}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
            color="GrayText"
          >
            {label}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, height: 32, display: 'flex', alignItems: 'center', ml: -2, mr: -2, mt: 0.5 }}
          >
            {readOnly ? (
              <ListItem key="dateInlineField-display">{displayValue}</ListItem>
            ) : (
              <ListItemButton key="dateInlineField-display-button" onClick={open ? undefined : handleOpen}>
                {displayValue}
              </ListItemButton>
            )}
          </Typography>
        </Box>
        {dateOnly ? (
          <MobileDatePicker
            key="date-picker"
            open={open}
            value={value}
            onChange={(date: Date | null) => setInternalValue(date ?? undefined)}
            renderInput={(params) => <TextField {...params} className="dateInlineField-dateTimeInput" />}
            onClose={handleClose}
          />
        ) : (
          <MobileDateTimePicker
            key="date-time-picker"
            open={open}
            value={value}
            onChange={(date: Date | null) => setInternalValue(date ?? undefined)}
            renderInput={(params) => <TextField {...params} className="dateInlineField-dateTimeInput" />}
            onClose={handleClose}
          />
        )}
      </Box>
    );
  }
);

export default DateInlineField;
