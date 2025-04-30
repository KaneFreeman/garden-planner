import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, formatDistance } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import DateInlineField from '../components/inline-fields/DateInlineField';
import TextInlineField from '../components/inline-fields/TextInlineField';
import { CUSTOM, Task } from '../interface';
import { getMidnight, setToMidnight } from '../utility/date.util';
import useSmallScreen from '../utility/smallScreen.util';
import { useRemoveTask, useUpdateTask } from './hooks/useTasks';

interface TaskViewProperties {
  task: Task;
}

const TaskView = ({ task }: TaskViewProperties) => {
  const navigate = useNavigate();

  const [isMarkingAsCompleted, setIsMarkingAsCompleted] = useState(false);
  const [isMarkingAsOpen, setIsMarkingAsOpen] = useState(false);
  const [completedOn, setCompletedOn] = useState<Date>(getMidnight());
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchParams] = useSearchParams();
  const backLabel = searchParams.get('backLabel');
  const backPath = searchParams.get('backPath');

  const updateTask = useUpdateTask();
  const removeTask = useRemoveTask();

  const [moreMenuAnchorElement, setMoreMenuAnchorElement] = useState<null | HTMLElement>(null);
  const moreMenuOpen = useMemo(() => Boolean(moreMenuAnchorElement), [moreMenuAnchorElement]);
  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorElement(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorElement(null);
  };

  const isSmallScreen = useSmallScreen();

  const today = useMemo(() => getMidnight().getTime(), []);

  const shouldLinkTo = useMemo(() => task.path && !backPath?.endsWith(task.path), [backPath, task.path]);
  const isCustom = useMemo(() => task.type === CUSTOM, [task.type]);

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

  const handleOnDelete = useCallback(() => {
    setIsDeleting(true);
    handleMoreMenuClose();
  }, []);
  const handleOnDeleteConfirm = useCallback(() => {
    removeTask(task._id);
    navigate(backPath ?? '/');
    setIsDeleting(false);
  }, [backPath, navigate, removeTask, task._id]);
  const handleOnDeleteClose = useCallback(() => setIsDeleting(false), []);

  const handleOnMarkAsOpen = useCallback(() => {
    setIsMarkingAsOpen(true);
    handleMoreMenuClose();
  }, []);

  const handleOnMarkAsComplete = useCallback(() => {
    setCompletedOn(getMidnight());
    setIsMarkingAsCompleted(true);
    handleMoreMenuClose();
  }, []);

  const handleOnChange = useCallback(
    async (newData: Partial<Task>) => {
      if (task) {
        updateTask({
          ...task,
          ...newData
        });
      }

      return undefined;
    },
    [task, updateTask]
  );

  const current = useMemo(
    () =>
      isSmallScreen
        ? {
            current: 'Task',
            actions: (
              <Box key="actions" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {shouldLinkTo && task.path ? (
                  <a href={task.path}>
                    <IconButton
                      key="go-to-button"
                      aria-label="go to"
                      color="secondary"
                      size="small"
                      title="Go to container"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </a>
                ) : null}
                {isCustom ? (
                  <>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={moreMenuOpen ? 'long-menu' : undefined}
                      aria-expanded={moreMenuOpen ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleMoreMenuClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={moreMenuAnchorElement}
                      open={moreMenuOpen}
                      onClose={handleMoreMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button'
                      }}
                    >
                      <MenuItem onClick={task.completedOn ? handleOnMarkAsOpen : handleOnMarkAsComplete}>
                        <ListItemIcon>
                          {task.completedOn ? (
                            <CheckBoxIcon color="success" key="reopen-icon" fontSize="small" />
                          ) : (
                            <CheckBoxOutlineBlankIcon color="primary" key="complete-icon" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <Typography color={task.completedOn ? 'success.main' : 'primary.main'}>
                          {task.completedOn ? 'Reopen' : 'Mark as complete'}
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={handleOnDelete}>
                        <ListItemIcon>
                          <DeleteIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <Typography color="error.main">Delete task</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                ) : null}
              </Box>
            )
          }
        : {
            current: 'Task',
            actions: (
              <Box key="actions-desktop" sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1.5 }}>
                {shouldLinkTo && task.path ? (
                  <a href={task.path}>
                    <Button key="go-to-button-desktop" color="secondary" title="Go to container">
                      <OpenInNewIcon sx={{ mr: 1 }} fontSize="small" />
                      Go to
                    </Button>
                  </a>
                ) : null}
                {isCustom ? (
                  <>
                    {task.completedOn ? (
                      <Button
                        key="reopen-button-desktop"
                        variant="outlined"
                        color="success"
                        onClick={handleOnMarkAsOpen}
                        title="Reopen"
                      >
                        <CheckBoxIcon sx={{ mr: 1 }} fontSize="small" />
                        Reopen
                      </Button>
                    ) : (
                      <Button
                        key="mark-complete-button-desktop"
                        variant="outlined"
                        color="primary"
                        onClick={handleOnMarkAsComplete}
                        title="Mark as complete"
                      >
                        <CheckBoxOutlineBlankIcon sx={{ mr: 1 }} fontSize="small" />
                        Mark as complete
                      </Button>
                    )}
                    <Button
                      key="delete-button-desktop"
                      variant="outlined"
                      color="error"
                      onClick={handleOnDelete}
                      title="Delete task"
                    >
                      <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                      Delete
                    </Button>
                  </>
                ) : null}
              </Box>
            )
          },
    [
      handleOnDelete,
      handleOnMarkAsComplete,
      handleOnMarkAsOpen,
      isCustom,
      isSmallScreen,
      moreMenuAnchorElement,
      moreMenuOpen,
      shouldLinkTo,
      task.completedOn,
      task.path
    ]
  );

  const formatDate = useCallback(
    (date: Date | undefined) => {
      const midnightDate = setToMidnight(date);
      if (!midnightDate) {
        return 'None';
      }

      if (midnightDate.getTime() > today) {
        return `${format(midnightDate, 'MMMM d')} (in ${formatDistance(midnightDate, today)})`;
      }

      if (midnightDate.getTime() === today) {
        return `${format(midnightDate, 'MMMM d')} (today)`;
      }

      return `${format(midnightDate, 'MMMM d')} (${formatDistance(midnightDate, today)} ago)`;
    },
    [today]
  );

  return (
    <>
      <Box sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
        <Breadcrumbs
          trail={[
            backLabel && backPath
              ? {
                  to: backPath,
                  label: backLabel
                }
              : {
                  to: `/`,
                  label: 'Tasks'
                }
          ]}
        >
          {current}
        </Breadcrumbs>
        <Box sx={{ mt: 2, width: '100%', boxSizing: 'border-box' }}>
          <TextInlineField
            label="Description"
            value={task.text}
            valueActive
            onChange={(text) => handleOnChange({ text })}
            sx={{
              minWidth: 0
            }}
            readOnly={task.type !== 'Custom'}
          />
          <DateInlineField
            label="Start Date"
            value={task.start}
            onChange={(start) => handleOnChange({ start })}
            renderer={formatDate}
            readOnly={task.type !== 'Custom'}
          />
          <DateInlineField
            label="Due Date"
            value={task.due}
            onChange={(due) => handleOnChange({ due })}
            renderer={formatDate}
            readOnly={task.type !== 'Custom'}
          />
          {task.completedOn !== null ? (
            <DateInlineField label="Completed Date" value={task.completedOn} renderer={formatDate} readOnly />
          ) : null}
        </Box>
      </Box>
      {isMarkingAsCompleted ? (
        <Dialog key="mark-complete-dialog" open onClose={() => setIsMarkingAsCompleted(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Mark as completed</DialogTitle>
          <DialogContent>
            <form name="plant-modal-form" onSubmit={markTaskAsCompleted} noValidate>
              <Box sx={{ display: 'flex', pt: 2, pb: 2 }}>
                <DatePicker
                  label="Completed On"
                  value={completedOn}
                  onChange={(newCompletedOn: Date | null) =>
                    newCompletedOn && setCompletedOn(setToMidnight(newCompletedOn))
                  }
                  slotProps={{ textField: { sx: { flexGrow: 1 } } }}
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
          <DialogTitle>Reopen</DialogTitle>
          <DialogContent>Reopen task {`'${task.text}'`}?</DialogContent>
          <DialogActions>
            <Button onClick={() => setIsMarkingAsOpen(false)}>Cancel</Button>
            <Button onClick={markTaskAsOpen} variant="contained">
              Reopen
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {isDeleting ? (
        <Dialog
          key="delete-dialog"
          open
          onClose={handleOnDeleteClose}
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
            <Button onClick={handleOnDeleteClose} color="primary" autoFocus>
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

export default TaskView;
