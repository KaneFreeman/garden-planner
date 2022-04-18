import { useCallback, useMemo } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Task } from '../../interface';
import { useTasksByPath } from '../useTasks';
import '../Tasks.css';
import TaskListItem from '../TaskListItem';

interface ContainerSlotTasksViewProps {
  containerId: string | undefined;
  slotId: number;
  type: 'slot' | 'sub-slot';
}

const ContainerSlotTasksView = ({ containerId, slotId, type }: ContainerSlotTasksViewProps) => {
  const path = useMemo(() => {
    if (!containerId) {
      return undefined;
    }

    return `/container/${containerId}/slot/${slotId}${type === 'sub-slot' ? '/sub-slot' : ''}`;
  }, [containerId, slotId, type]);

  const { tasks, completed, overdue, next, current } = useTasksByPath(path, -1, { reverseSortCompleted: false });

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const renderTask = useCallback(
    (key: string, task: Task, index: number, options?: { showStart?: boolean; isOverdue?: boolean }) => {
      const { showStart = false, isOverdue = false } = options || {};
      return (
        <TaskListItem key={`${key}-${index}`} today={today} task={task} showStart={showStart} isOverdue={isOverdue} />
      );
    },
    [today]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
        color="GrayText"
      >
        Tasks
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
              {overdue.map((task, index) => renderTask('completed', task, index, { isOverdue: true }))}
              {current.map((task, index) => renderTask('completed', task, index))}
              {next.map((task, index) => renderTask('completed', task, index, { showStart: true }))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContainerSlotTasksView;
