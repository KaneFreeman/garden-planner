/* eslint-disable react/jsx-props-no-spreading */
import { memo, useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import format from 'date-fns/format';
import './DateInlineField.css';

interface DateInlineFieldProps {
  label: React.ReactNode;
  value: Date | undefined;
  onChange(value: Date | undefined): void;
}

const DateInlineField = memo(({ label, value, onChange }: DateInlineFieldProps) => {
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
    if (internalValue !== value) {
      onChange(internalValue);
    }
  }, [internalValue, onChange, value]);

  return (
    <Box className="dateInlineField-root">
      <Box onClick={open ? undefined : handleOpen}>
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
          <ListItem button key="dateInlineField-display" onClick={open ? undefined : handleOpen}>
            {value ? format(value, 'MMM d, yyyy h:mmaaa') : 'None'}
          </ListItem>
        </Typography>
      </Box>
      <MobileDateTimePicker
        open={open}
        value={value}
        onChange={(date: Date | null) => setInternalValue(date ?? undefined)}
        renderInput={(params) => <TextField {...params} className="dateInlineField-dateTimeInput" />}
        onClose={handleClose}
      />
    </Box>
  );
});

export default DateInlineField;
