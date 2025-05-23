import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useCallback, useState } from 'react';
import TextField from '../components/TextField';
import { Task } from '../interface';
import { getMidnight, setToMidnight } from '../utility/date.util';
import { useAddTask } from './hooks/useTasks';

interface TaskModalProperties {
  open: boolean;
  path?: string | null;
  plantInstanceId?: string | null;
  onClose: () => void;
}

function isValidTask(task: Partial<Task> | null): task is Omit<Task, 'id' | 'type' | 'path' | 'completedOn'> {
  return task?.text !== undefined && task?.start !== undefined && task?.due !== undefined;
}

const TaskModal = ({ open, path = null, plantInstanceId, onClose }: TaskModalProperties) => {
  const [editData, setEditData] = useState<Partial<Task> | null>({
    start: getMidnight(),
    due: getMidnight()
  });

  const addTask = useAddTask();

  const handleOnClose = useCallback(() => {
    setEditData({
      start: getMidnight(),
      due: getMidnight()
    });
    onClose();
  }, [onClose]);

  const onSave = useCallback(() => {
    if (isValidTask(editData)) {
      const { text, start, due } = editData;

      start.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      addTask({
        text,
        start,
        due,
        plantInstanceId: plantInstanceId ?? null,
        type: 'Custom',
        path,
        completedOn: null
      });

      handleOnClose();
    }
  }, [addTask, editData, handleOnClose, path, plantInstanceId]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSave();
    },
    [onSave]
  );

  const update = useCallback(
    (data: Partial<Task>) => {
      setEditData({
        ...editData,
        ...data
      });
    },
    [editData]
  );

  return (
    <Dialog open={open} onClose={handleOnClose} maxWidth="sm" fullWidth>
      <form name="task-modal-form" onSubmit={onSubmit} noValidate>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Text"
            value={editData?.text}
            onChange={(text) => update({ text })}
            required
            variant="outlined"
          />
          <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
            <DatePicker
              label="Start"
              value={editData?.start}
              onChange={(start: Date | null) => start && update({ start: setToMidnight(start) })}
              slotProps={{ textField: { sx: { flexGrow: 1 } } }}
            />
            <DatePicker
              label="Due"
              value={editData?.due}
              onChange={(due: Date | null) => due && update({ due: setToMidnight(due) })}
              slotProps={{ textField: { sx: { flexGrow: 1, ml: 2 } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
