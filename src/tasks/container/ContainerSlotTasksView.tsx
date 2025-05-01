import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo, useState } from 'react';
import { CUSTOM, PlantInstance, Task, TaskGroup } from '../../interface';
import { getMidnight } from '../../utility/date.util';
import useSmallScreen from '../../utility/smallScreen.util';
import { useTasksByPlantInstance } from '../hooks/useTasks';
import TaskListItem from '../TaskListItem';
import TaskModal from '../TaskModal';

interface ContainerSlotTasksViewProps {
  plantInstance: PlantInstance | undefined;
  containerId: string | undefined;
  slotId: number;
  slotTitle: string;
}

const ContainerSlotTasksView = ({ plantInstance, containerId, slotId, slotTitle }: ContainerSlotTasksViewProps) => {
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

    return `/container/${containerId}/slot/${slotId}`;
  }, [containerId, slotId]);

  const { completed, overdue, next, active, thisWeek } = useTasksByPlantInstance(plantInstance?._id, -1);

  const today = useMemo(() => getMidnight().getTime(), []);

  const renderTask = useCallback(
    (
      key: string,
      task: Task | TaskGroup,
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
          disableSelect={true}
          disabled={path != null}
          back={
            path
              ? {
                  path,
                  title: `${slotTitle}`
                }
              : undefined
          }
        />
      );
    },
    [path, slotTitle, today]
  );

  const completedCustomTasks = useMemo(() => completed.filter((task) => task.type === CUSTOM), [completed]);
  const hasNoTasks = useMemo(
    () =>
      completedCustomTasks.length === 0 &&
      overdue.length === 0 &&
      thisWeek.length === 0 &&
      active.length === 0 &&
      next.length === 0,
    [active.length, completedCustomTasks.length, next.length, overdue.length, thisWeek.length]
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
          {hasNoTasks ? (
            <Alert severity="info" sx={{ m: 2 }}>
              No tasks at this time!
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <List>
                {completedCustomTasks.map((task, index) => renderTask('completed', task, index))}
                {overdue.map((task, index) => renderTask('overdue', task, index, { isOverdue: true }))}
                {thisWeek.map((task, index) => renderTask('thisWeek', task, index, { isThisWeek: true }))}
                {active.map((task, index) => renderTask('active', task, index))}
                {next.map((task, index) => renderTask('next', task, index, { showStart: true }))}
              </List>
            </Box>
          )}
        </Box>
      </Box>
      <TaskModal open={isCreateTaskModalOpen} path={path} plantInstanceId={plantInstance?._id} onClose={closeModals} />
    </>
  );
};

export default ContainerSlotTasksView;
