import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useState } from 'react';
import { getMidnight, setToMidnight } from '../utility/date.util';

interface DateDialogProps {
  open: boolean;
  question: string;
  label: string;
  cancel?: string;
  confirm?: string;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const DateDialog = ({
  open,
  question,
  label,
  cancel = 'Cancel',
  confirm = 'Save',
  onClose,
  onConfirm
}: DateDialogProps) => {
  const [date, setDate] = useState<Date>(getMidnight());

  const handleSubmit = useCallback(() => {
    onConfirm(date);
    onClose();
  }, [date, onClose, onConfirm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{question}</DialogTitle>
      <DialogContent>
        <form name="plant-modal-form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', pt: 2 }}>
            <DatePicker
              label={label}
              value={date}
              onChange={(newDate: Date | null) => newDate && setDate(setToMidnight(newDate))}
              slotProps={{ textField: { sx: { flexGrow: 1 } } }}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancel}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateDialog;
