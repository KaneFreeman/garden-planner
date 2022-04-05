/* eslint-disable react/no-unstable-nested-components */
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
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField as MuiTextField,
  List,
  Menu,
  MenuItem,
  DialogContentText
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useRemoveTask, useTasks, useUpdateTask } from './useTasks';
import Tabs from '../components/tabs/Tabs';
import TabPanel from '../components/tabs/TabPanel';
import { Task } from '../interface';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const removeTask = useRemoveTask();
  const updateTask = useUpdateTask();

  const [tab, setTab] = useState(0);
  const [taskToMarkAsCompleted, setTaskToMarkAsCompleted] = useState<Task | null>(null);
  const [taskToMarkAsOpen, setTaskToMarkAsOpen] = useState<Task | null>(null);
  const [completedOn, setCompletedOn] = useState<Date>(new Date());

  const { tasks, completed, overdue, next30Days, current } = useTasks();

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleOnDelete = useCallback((task: Task) => setDeletingTask(task), []);
  const handleOnDeleteConfirm = useCallback(() => {
    if (deletingTask) {
      removeTask(deletingTask._id);
      setDeletingTask(null);
    }
  }, [removeTask, deletingTask]);
  const handleOnClose = useCallback(() => setDeletingTask(null), []);

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
    task: Task;
  } | null>(null);

  const handleContextMenu = useCallback(
    (task: Task) => (event: React.MouseEvent) => {
      event.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX - 2,
              mouseY: event.clientY - 4,
              task
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null
      );
    },
    [contextMenu]
  );

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleOnDeleteClick = useCallback(() => {
    if (contextMenu !== null) {
      handleOnDelete(contextMenu.task);
      setContextMenu(null);
    }
  }, [contextMenu, handleOnDelete]);

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
    (key: string, task: Task, index: number, options?: { showStart: boolean; style?: React.CSSProperties }) => {
      const { showStart = false, style } = options || {};

      let secondaryText: string;
      if (task.completedOn !== null) {
        secondaryText = `Completed ${format(task.completedOn, 'MMM d')}`;
      } else {
        secondaryText = `${showStart ? `Starts ${format(task.start, 'MMM d')}, ` : ''}Due ${format(task.due, 'MMM d')}`;
      }

      return (
        <ListItem className="task" style={style} key={`${key}-${index}`} disablePadding>
          <ListItemButton
            onClick={contextMenu == null ? onClickHandler(task) : undefined}
            sx={{
              width: '100%'
            }}
            onContextMenu={task.type === 'Custom' ? handleContextMenu(task) : undefined}
          >
            <ListItemIcon>
              {task.completedOn !== null ? <CheckBoxIcon color="success" /> : <CheckBoxOutlineBlankIcon />}
            </ListItemIcon>
            <ListItemText
              primary={task.text}
              secondary={secondaryText}
              classes={{
                primary: 'textPrimary',
                secondary: 'textSecondary'
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    },
    [contextMenu, handleContextMenu, onClickHandler]
  );

  const renderVirtualTask = useCallback(
    (key: string, tasksToRender: Task[], showStart = false) =>
      ({ index, style }: ListChildComponentProps) =>
        renderTask(key, tasksToRender[index], index, { showStart, style }),
    [renderTask]
  );

  const markTaskAsCompleted = useCallback(() => {
    if (taskToMarkAsCompleted) {
      updateTask({
        ...taskToMarkAsCompleted,
        completedOn
      });
      setTaskToMarkAsCompleted(null);
    }
  }, [completedOn, taskToMarkAsCompleted, updateTask]);

  const markTaskAsOpen = useCallback(() => {
    if (taskToMarkAsOpen) {
      updateTask({
        ...taskToMarkAsOpen,
        completedOn: null
      });
      setTaskToMarkAsOpen(null);
    }
  }, [taskToMarkAsOpen, updateTask]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {tasks.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No tasks at this time!
          </Alert>
        ) : (
          <>
            <Tabs ariaLabel="tasks tabs" onChange={(newTab) => setTab(newTab)} sxRoot={{ top: 56 }}>
              {{
                label: 'Open'
              }}
              {{
                label: 'Completed'
              }}
            </Tabs>
            <TabPanel ariaLabel="tasks open tab" value={tab} index={0}>
              {overdue.length > 0 || current.length > 0 || next30Days.length > 0 ? (
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {overdue.length > 0 ? (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                      >
                        Overdue
                      </Typography>
                      <Box component="nav" aria-label="main tasks-overdue">
                        <List>{overdue.map((task, index) => renderTask('overdue', task, index))}</List>
                      </Box>
                    </Box>
                  ) : null}
                  {current.length > 0 ? (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                      >
                        Current
                      </Typography>
                      <Box component="nav" aria-label="main tasks-current">
                        <List>{current.map((task, index) => renderTask('overdue', task, index))}</List>
                      </Box>
                    </Box>
                  ) : null}
                  {next30Days.length > 0 ? (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                      >
                        Next 30 Days
                      </Typography>
                      <Box component="nav" aria-label="main tasks-future">
                        <List>
                          {next30Days.map((task, index) => renderTask('overdue', task, index, { showStart: true }))}
                        </List>
                      </Box>
                    </Box>
                  ) : null}
                </Box>
              ) : (
                <Alert severity="info" sx={{ m: 2 }}>
                  No open tasks at this time!
                </Alert>
              )}
            </TabPanel>
            <TabPanel
              ariaLabel="tasks closed tab"
              value={tab}
              index={1}
              sx={{ overflow: 'hidden', height: 'calc(100vh - 113px)' }}
            >
              {completed.length > 0 ? (
                <Box sx={{ pl: 2, pr: 2, boxSizing: 'border-box', height: '100%' }}>
                  <Box
                    component="nav"
                    aria-label="main tasks-complete"
                    sx={{ boxSizing: 'border-box', height: '100%', mr: -2 }}
                  >
                    <AutoSizer>
                      {({ height, width }) => (
                        <FixedSizeList
                          height={height}
                          width={width}
                          itemSize={72}
                          itemCount={completed.length}
                          overscanCount={5}
                        >
                          {renderVirtualTask('completed', completed)}
                        </FixedSizeList>
                      )}
                    </AutoSizer>
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
        <Dialog key="markAsOpen-dialog" open onClose={() => setTaskToMarkAsOpen(null)} maxWidth="xs" fullWidth>
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
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem onClick={handleOnDeleteClick}>Delete</MenuItem>
      </Menu>
      {deletingTask !== null ? (
        <Dialog
          key="delete-dialog"
          open
          onClose={handleOnClose}
          aria-labelledby="deleting-task-title"
          aria-describedby="deleting-task-description"
        >
          <DialogTitle id="deleting-task-title">Delete task</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-task-description">
              Are you sure you want to delete task {`'${deletingTask?.text}'`}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={handleOnDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default Tasks;
