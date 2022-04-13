/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import ListItemButton from '@mui/material/ListItemButton';
import DialogContentText from '@mui/material/DialogContentText';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiTextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Task } from '../interface';
import { useRemoveTask, useUpdateTask } from './useTasks';
import './Tasks.css';

interface TaskListItemProps {
  today: number;
  task: Task;
  showStart?: boolean;
  isOverdue?: boolean;
  style?: React.CSSProperties;
}

const TaskListItem = ({ today, task, showStart = false, isOverdue = false, style }: TaskListItemProps) => {
  const navigate = useNavigate();
  const removeTask = useRemoveTask();
  const updateTask = useUpdateTask();

  const [isMarkingAsCompleted, setIsMarkingAsCompleted] = useState(false);
  const [isMarkingAsOpen, setIsMarkingAsOpen] = useState(false);
  const [completedOn, setCompletedOn] = useState<Date>(new Date());
  const [isDeleting, setIsDeleting] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const shouldLinkTo = useMemo(() => task.path && !window.location.pathname.endsWith(task.path), [task.path]);

  const markTaskAsCompleted = useCallback(() => {
    updateTask({
      ...task,
      completedOn
    });
    setIsMarkingAsCompleted(false);
  }, [completedOn, task, updateTask]);

  const markTaskAsOpen = useCallback(() => {
    updateTask({
      ...task,
      completedOn: null
    });
    setIsMarkingAsOpen(false);
  }, [task, updateTask]);

  const handleOnDelete = useCallback(() => setIsDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    removeTask(task._id);
    setIsDeleting(false);
  }, [removeTask, task]);
  const handleOnClose = useCallback(() => setIsDeleting(false), []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX - 2,
              mouseY: event.clientY - 4
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
      handleOnDelete();
      setContextMenu(null);
    }
  }, [contextMenu, handleOnDelete]);

  const onClickHandler = useCallback(() => {
    if (task.path !== null) {
      if (shouldLinkTo) {
        navigate(task.path);
      }
      return;
    }

    if (task.completedOn !== null) {
      setIsMarkingAsOpen(true);
    } else {
      setCompletedOn(new Date());
      setIsMarkingAsCompleted(true);
    }
  }, [navigate, shouldLinkTo, task.completedOn, task.path]);

  const secondaryText = useMemo(() => {
    let text = '';

    if (task.completedOn !== null) {
      text += `Completed ${format(task.completedOn, 'MMM d')}`;
      if (task.completedOn.getTime() < today) {
        text += ` (${formatDistance(today, task.completedOn)} ago)`;
      }
    } else {
      if (showStart) {
        text += `${showStart ? `Starts ${format(task.start, 'MMM d')}` : ''}`;
        if (task.due.getTime() > today) {
          text += ` (in ${formatDistance(task.start, today)})`;
        }
        text += ', ';
      }

      text += `Due ${format(task.due, 'MMM d')}`;
      if (task.due.getTime() < today) {
        text += ` (${formatDistance(today, task.due)} ago)`;
      } else if (task.due.getTime() === today) {
        text += ` (today)`;
      } else {
        text += ` (in ${formatDistance(task.due, today)})`;
      }
    }

    return text;
  }, [showStart, task.completedOn, task.due, task.start, today]);

  const wrap = useCallback(
    (children: ReactNode) =>
      shouldLinkTo || task.type === 'Custom' ? (
        <ListItemButton
          onClick={contextMenu == null ? onClickHandler : undefined}
          sx={{
            width: '100%'
          }}
          onContextMenu={task.type === 'Custom' ? handleContextMenu : undefined}
        >
          {children}
        </ListItemButton>
      ) : (
        <ListItem
          sx={{
            width: '100%'
          }}
        >
          {children}
        </ListItem>
      ),
    [contextMenu, handleContextMenu, onClickHandler, shouldLinkTo, task.type]
  );

  return (
    <>
      <ListItem style={style} className="task" disablePadding>
        {wrap(
          <>
            <ListItemIcon>
              {task.completedOn !== null ? <CheckBoxIcon color="success" /> : <CheckBoxOutlineBlankIcon />}
            </ListItemIcon>
            {isOverdue ? <ErrorIcon sx={{ mr: 1 }} color="error" /> : null}
            <ListItemText
              primary={task.text}
              secondary={secondaryText}
              classes={{
                primary: 'textPrimary',
                secondary: 'textSecondary'
              }}
            />
          </>
        )}
      </ListItem>
      {isMarkingAsCompleted ? (
        <Dialog open onClose={() => setIsMarkingAsCompleted(false)} maxWidth="xs" fullWidth>
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
            <Button onClick={() => setIsMarkingAsCompleted(false)}>Cancel</Button>
            <Button onClick={markTaskAsCompleted} variant="contained">
              Mark Completed
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {isMarkingAsOpen ? (
        <Dialog key="markAsOpen-dialog" open onClose={() => setIsMarkingAsOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Mark as open</DialogTitle>
          <DialogContent>Mark task {`'${task.text}'`} as open?</DialogContent>
          <DialogActions>
            <Button onClick={() => setIsMarkingAsOpen(false)}>Cancel</Button>
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
      {isDeleting ? (
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
              Are you sure you want to delete task {`'${task.text}'`}?
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

export default TaskListItem;
