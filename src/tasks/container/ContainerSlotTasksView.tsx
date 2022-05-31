import { useCallback, useMemo, useState } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Task } from '../../interface';
import useSmallScreen from '../../utility/smallScreen.util';
import { getMidnight } from '../../utility/date.util';
import { useTasksByPath } from '../hooks/useTasks';
import TaskListItem from '../TaskListItem';
import TaskModal from '../TaskModal';

interface ContainerSlotTasksViewProps {
  containerId: string | undefined;
  slotId: number;
  slotTitle: string;
  type: 'slot' | 'sub-slot';
}

const ContainerSlotTasksView = ({ containerId, slotId, slotTitle, type }: ContainerSlotTasksViewProps) => {
  const isSmallScreen = useSmallScreen();

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const openTaskModal = useCallback(() => {
    setIsCreateTaskModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsCreateTaskModalOpen(false);
  }, []);

  const path = useMemo(() => {
    if (!containerId) {
      return undefined;
    }

    return `/container/${containerId}/slot/${slotId}${type === 'sub-slot' ? '/sub-slot' : ''}`;
  }, [containerId, slotId, type]);

  const { tasks, completed, overdue, next, active, thisWeek } = useTasksByPath(path, -1, {
    reverseSortCompleted: false
  });

  const today = useMemo(() => getMidnight().getTime(), []);

  const renderTask = useCallback(
    (
      key: string,
      task: Task,
      index: number,
      options?: { showStart?: boolean; isThisWeek?: boolean; isOverdue?: boolean }
    ) => {
      const { showStart = false, isThisWeek = false, isOverdue = false } = options || {};
      return (
        <TaskListItem
          key={`${key}-${index}`}
          today={today}
          task={task}
          showStart={showStart}
          isThisWeek={isThisWeek}
          isOverdue={isOverdue}
          back={
            path
              ? {
                  path,
                  title: `${slotTitle}${type === 'sub-slot' ? ` - Sub Plant` : ''}`
                }
              : undefined
          }
        />
      );
    },
    [path, slotTitle, today, type]
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            flexGrow: 1,
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: isSmallScreen ? 'space-between' : undefined
          }}
          color="GrayText"
        >
          Tasks
          <IconButton aria-label="add" color="primary" onClick={openTaskModal} title="Add task">
            <AddIcon />
          </IconButton>
        </Typography>
        <Box sx={{ width: '100%' }}>
          {tasks.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>
              No tasks at this time!
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <List>
                {completed.map((task, index) => renderTask('completed', task, index))}
                {overdue.map((task, index) => renderTask('overdue', task, index, { isOverdue: true }))}
                {thisWeek.map((task, index) => renderTask('thisWeek', task, index, { isThisWeek: true }))}
                {active.map((task, index) => renderTask('active', task, index))}
                {next.map((task, index) => renderTask('next', task, index, { showStart: true }))}
              </List>
            </Box>
          )}
        </Box>
      </Box>
      <TaskModal open={isCreateTaskModalOpen} path={path} onClose={closeModals} />
    </>
  );
};

export default ContainerSlotTasksView;
