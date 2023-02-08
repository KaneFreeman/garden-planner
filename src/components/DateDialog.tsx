/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiTextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
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

  const finishUpdateStatusFertilized = useCallback(() => {
    onConfirm(date);
    onClose();
    setDate(getMidnight());
  }, [date, onClose, onConfirm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{question}</DialogTitle>
      <DialogContent>
        <form name="plant-modal-form" onSubmit={finishUpdateStatusFertilized} noValidate>
          <Box sx={{ display: 'flex', pt: 2 }}>
            <MobileDatePicker
              label={label}
              value={date}
              onChange={(newDate: Date | null) => newDate && setDate(setToMidnight(newDate))}
              renderInput={(params) => <MuiTextField {...params} sx={{ flexGrow: 1 }} />}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancel}</Button>
        <Button onClick={finishUpdateStatusFertilized} variant="contained">
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateDialog;
