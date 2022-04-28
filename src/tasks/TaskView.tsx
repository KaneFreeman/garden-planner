/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiTextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Task } from '../interface';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRemoveTask, useUpdateTask } from './hooks/useTasks';
import TextInlineField from '../components/inline-fields/TextInlineField';
import DateInlineField from '../components/inline-fields/DateInlineField';
import { setToMidnight } from '../utility/date.util';

interface TaskViewProperties {
  task: Task;
}

const TaskView = ({ task }: TaskViewProperties) => {
  const navigate = useNavigate();

  const [isMarkingAsCompleted, setIsMarkingAsCompleted] = useState(false);
  const [isMarkingAsOpen, setIsMarkingAsOpen] = useState(false);
  const [completedOn, setCompletedOn] = useState<Date>(new Date());
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchParams] = useSearchParams();
  const backPath = searchParams.get('backPath');

  const updateTask = useUpdateTask();
  const removeTask = useRemoveTask();

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const shouldLinkTo = useMemo(() => task.path && !backPath?.endsWith(task.path), [backPath, task.path]);
  const canComplete = useMemo(() => task.type === 'Custom' || task.type === 'Fertilize', [task.type]);
  const canDelete = useMemo(() => task.type === 'Custom', [task.type]);

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
    navigate(backPath ?? '/');
    setIsDeleting(false);
  }, [backPath, navigate, removeTask, task._id]);
  const handleOnDeleteClose = useCallback(() => setIsDeleting(false), []);

  const handleOnGoTo = useCallback(() => {
    if (task.path !== null) {
      navigate(task.path);
    }
  }, [navigate, task.path]);

  const handleOnMarkAsOpen = useCallback(() => {
    setIsMarkingAsOpen(true);
  }, []);

  const handleOnMarkAsComplete = useCallback(() => {
    setCompletedOn(new Date());
    setIsMarkingAsCompleted(true);
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
              <Box key="actions" sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                {shouldLinkTo ? (
                  <IconButton
                    key="go-to-button"
                    aria-label="go to"
                    color="secondary"
                    size="small"
                    onClick={handleOnGoTo}
                    title="Go to task target"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                ) : null}
                {canComplete ? (
                  <IconButton
                    key="mark-complete-button"
                    aria-label={task.completedOn ? 'reopen' : 'mark as complete'}
                    color={task.completedOn ? 'success' : 'primary'}
                    size="small"
                    onClick={task.completedOn ? handleOnMarkAsOpen : handleOnMarkAsComplete}
                    title={task.completedOn ? 'Reopen' : 'Mark as complete'}
                  >
                    {task.completedOn ? (
                      <CheckBoxIcon key="reopen-icon" fontSize="small" />
                    ) : (
                      <CheckBoxOutlineBlankIcon key="complete-icon" fontSize="small" />
                    )}
                  </IconButton>
                ) : null}
                {canDelete ? (
                  <IconButton
                    key="delete-button"
                    aria-label="delete"
                    color="error"
                    size="small"
                    onClick={handleOnDelete}
                    title="Delete task"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Box>
            )
          }
        : {
            current: 'Task',
            actions: (
              <Box key="actions-desktop" sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1.5 }}>
                {shouldLinkTo ? (
                  <Button key="go-to-button-desktop" color="secondary" onClick={handleOnGoTo} title="Go to task target">
                    <OpenInNewIcon sx={{ mr: 1 }} fontSize="small" />
                    Go to
                  </Button>
                ) : null}
                {/* eslint-disable-next-line no-nested-ternary */}
                {canComplete ? (
                  task.completedOn ? (
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
                  )
                ) : null}
                {canDelete ? (
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
                ) : null}
              </Box>
            )
          },
    [
      canComplete,
      canDelete,
      handleOnDelete,
      handleOnGoTo,
      handleOnMarkAsComplete,
      handleOnMarkAsOpen,
      isSmallScreen,
      shouldLinkTo,
      task.completedOn
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
            {
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
            dateOnly
          />
          <DateInlineField
            label="Due Date"
            value={task.due}
            onChange={(due) => handleOnChange({ due })}
            renderer={formatDate}
            readOnly={task.type !== 'Custom'}
            dateOnly
          />
          {task.completedOn !== null ? (
            <DateInlineField
              label="Completed Date"
              value={task.completedOn}
              renderer={formatDate}
              readOnly
              dateOnly
            />
          ) : null}
        </Box>
      </Box>
      {isMarkingAsCompleted ? (
        <Dialog key="mark-complete-dialog" open onClose={() => setIsMarkingAsCompleted(false)} maxWidth="xs" fullWidth>
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
