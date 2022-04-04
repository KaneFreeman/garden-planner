/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField as MuiTextField
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Task, TasksCollection } from '../../api/Tasks';
import useTasks from '../hooks/useTasks';
import Tabs from '../components/tabs/Tabs';
import TabPanel from '../components/tabs/TabPanel';

const Tasks = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [taskToMarkAsCompleted, setTaskToMarkAsCompleted] = useState<Task | null>(null);
  const [taskToMarkAsOpen, setTaskToMarkAsOpen] = useState<Task | null>(null);
  const [completedOn, setCompletedOn] = useState<Date>(new Date());

  const { tasks, completed, overdue, next30Days, current } = useTasks();

  const onClickHandler = useCallback(
    (task: Task) => () => {
      if (task.path !== null) {
        navigate(task.path);
        return;
      }

      if (task.completedOn !== null) {
        setTaskToMarkAsOpen(task);
      } else {
        setCompletedOn(new Date());
        setTaskToMarkAsCompleted(task);
      }
    },
    [navigate]
  );

  const renderTask = useCallback(
    (task: Task) => (
      <ListItem key={`task-${task._id}`} disablePadding>
        <ListItemButton onClick={onClickHandler(task)}>
          <ListItemIcon>
            {task.completedOn !== null ? <CheckBoxIcon color="success" /> : <CheckBoxOutlineBlankIcon />}
          </ListItemIcon>
          <ListItemText primary={task.text} secondary={`Due ${format(task.due, 'MMM d')}`} />
        </ListItemButton>
      </ListItem>
    ),
    [onClickHandler]
  );

  const markTaskAsCompleted = useCallback(() => {
    if (taskToMarkAsCompleted) {
      TasksCollection.update(taskToMarkAsCompleted._id, { $set: { completedOn } });
      setTaskToMarkAsCompleted(null);
    }
  }, [completedOn, taskToMarkAsCompleted]);

  const markTaskAsOpen = useCallback(() => {
    if (taskToMarkAsOpen) {
      TasksCollection.update(taskToMarkAsOpen._id, { $set: { completedOn: null } });
      setTaskToMarkAsOpen(null);
    }
  }, [taskToMarkAsOpen]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {tasks.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No tasks at this time!
          </Alert>
        ) : (
          <>
            <Tabs ariaLabel="tasks tabs" onChange={(newTab) => setTab(newTab)} sxRoot={{ top: 64 }}>
              {{
                label: 'Open'
              }}
              {{
                label: 'Completed'
              }}
            </Tabs>
            <TabPanel ariaLabel="tasks open tab" value={tab} index={0}>
              {overdue.length > 0 || current.length > 0 || next30Days.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  {overdue.length > 0 ? (
                    <>
                      <Typography variant="h6">Overdue</Typography>
                      <Box component="nav" aria-label="main tasks-overdue" sx={{ mb: 2 }}>
                        <List>{overdue.map(renderTask)}</List>
                      </Box>
                    </>
                  ) : null}
                  {current.length > 0 ? (
                    <>
                      <Typography variant="h6">Current</Typography>
                      <Box component="nav" aria-label="main tasks-current" sx={{ mb: 2 }}>
                        <List>{current.map(renderTask)}</List>
                      </Box>
                    </>
                  ) : null}
                  {next30Days.length > 0 ? (
                    <>
                      <Typography variant="h6">Next 30 Days</Typography>
                      <Box component="nav" aria-label="main tasks-future" sx={{ mb: 2 }}>
                        <List>{next30Days.map(renderTask)}</List>
                      </Box>
                    </>
                  ) : null}
                </Box>
              ) : (
                <Alert severity="info" sx={{ m: 2 }}>
                  No open tasks at this time!
                </Alert>
              )}
            </TabPanel>
            <TabPanel ariaLabel="tasks closed tab" value={tab} index={1}>
              {completed.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">Completed</Typography>
                  <Box component="nav" aria-label="main tasks-complete" sx={{ mb: 2 }}>
                    <List>{completed.map(renderTask)}</List>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info" sx={{ m: 2 }}>
                  No completed tasks at this time!
                </Alert>
              )}
            </TabPanel>
          </>
        )}
      </Box>
      <Dialog
        open={taskToMarkAsCompleted !== null}
        onClose={() => setTaskToMarkAsCompleted(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Mark as completed</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={markTaskAsCompleted} noValidate>
            <Box sx={{ display: 'flex', pt: 2, pb: 2 }}>
              <MobileDatePicker
                label="Completed On"
                value={completedOn}
                onChange={(newCompletedOn: Date | null) => newCompletedOn && setCompletedOn(newCompletedOn)}
                renderInput={(params) => (
                  <MuiTextField {...params} className="due-dateTimeInput" sx={{ flexGrow: 1 }} />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskToMarkAsCompleted(null)}>Cancel</Button>
          <Button onClick={markTaskAsCompleted} variant="contained">
            Mark Completed
          </Button>
        </DialogActions>
      </Dialog>
      {taskToMarkAsOpen !== null ? (
        <Dialog open onClose={() => setTaskToMarkAsOpen(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Mark as open</DialogTitle>
          <DialogContent>Mark task {`'${taskToMarkAsOpen?.text}'`} as open?</DialogContent>
          <DialogActions>
            <Button onClick={() => setTaskToMarkAsOpen(null)}>Cancel</Button>
            <Button onClick={markTaskAsOpen} variant="contained">
              Mark Open
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default Tasks;
