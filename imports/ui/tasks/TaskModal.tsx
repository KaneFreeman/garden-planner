/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField as MuiTextField,
  Box
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Task, TasksCollection } from '../../api/Tasks';
import TextField from '../components/TextField';

interface TaskModalProperties {
  open: boolean;
  onClose: () => void;
}

function isValidTask(task: Partial<Task> | null): task is Omit<Task, 'id' | 'type' | 'path' | 'completedOn'> {
  return task?.text !== undefined && task?.start !== undefined && task?.due !== undefined;
}

const TaskModal = ({ open, onClose }: TaskModalProperties) => {
  const [editData, setEditData] = useState<Partial<Task> | null>({
    start: new Date(),
    due: new Date()
  });

  const handleOnClose = useCallback(() => {
    setEditData({
      start: new Date(),
      due: new Date()
    });
    onClose();
  }, [onClose]);

  const onSave = useCallback(() => {
    if (isValidTask(editData)) {
      const { text, start, due } = editData;

      start.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      TasksCollection.insert({
        text,
        start,
        due,
        type: 'Custom',
        path: null,
        completedOn: null
      });
      handleOnClose();
    }
  }, [editData, handleOnClose]);

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            <MobileDatePicker
              label="Start"
              value={editData?.start}
              onChange={(start: Date | null) => start && update({ start })}
              renderInput={(params) => (
                <MuiTextField {...params} className="start-dateTimeInput" sx={{ flexGrow: 1 }} />
              )}
            />
            <MobileDatePicker
              label="Due"
              value={editData?.due}
              onChange={(due: Date | null) => due && update({ due })}
              renderInput={(params) => (
                <MuiTextField {...params} className="due-dateTimeInput" sx={{ flexGrow: 1, ml: 2 }} />
              )}
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
