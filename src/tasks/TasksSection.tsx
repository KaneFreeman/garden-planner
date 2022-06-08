import React, { useCallback, useMemo, useState } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import YardIcon from '@mui/icons-material/Yard';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { getMidnight } from '../utility/date.util';
import { FERTILIZE, HARVEST, Task } from '../interface';
import DateDialog from '../components/DateDialog';
import TaskListItem from './TaskListItem';
import { useBulkCompleteTasks } from './hooks/useTasks';
import './Tasks.css';

interface TasksSettings {
  showStart?: boolean;
  isThisWeek?: boolean;
  isOverdue?: boolean;
  style?: React.CSSProperties;
}

interface TasksSectionProps {
  title: string;
  tasks: Task[];
  options?: TasksSettings;
}

const TasksSection = ({ title, tasks, options }: TasksSectionProps) => {
  const today = useMemo(() => getMidnight().getTime(), []);

  const bulkCompleteTasks = useBulkCompleteTasks();

  const [showHarvestedDialogue, setShowHarvestedDialogue] = useState(false);
  const [showFertilizedDialogue, setShowFertilizedDialogue] = useState(false);

  const renderTask = useCallback(
    (task: Task, index: number) => {
      const { showStart = false, isThisWeek = false, isOverdue = false, style } = options || {};
      return (
        <TaskListItem
          key={`${title}-${index}`}
          today={today}
          task={task}
          showStart={showStart}
          isThisWeek={isThisWeek}
          isOverdue={isOverdue}
          style={style}
        />
      );
    },
    [options, title, today]
  );

  const harvestTasks = useMemo(
    () => tasks.filter((task) => task.type === HARVEST && today >= task.start.getTime()).map((task) => task._id),
    [tasks, today]
  );

  const fertilizeTasks = useMemo(
    () => tasks.filter((task) => task.type === FERTILIZE && today >= task.start.getTime()).map((task) => task._id),
    [tasks, today]
  );

  const onHarvestClick = useCallback(() => {
    setShowHarvestedDialogue(true);
  }, []);

  const onFertilizeClick = useCallback(() => {
    setShowFertilizedDialogue(true);
  }, []);

  const finishUpdateStatusHarvested = useCallback(
    (date: Date) => {
      bulkCompleteTasks({
        type: HARVEST,
        taskIds: harvestTasks,
        date: date.toISOString()
      });
    },
    [bulkCompleteTasks, harvestTasks]
  );

  const finishUpdateStatusFertilized = useCallback(
    (date: Date) => {
      bulkCompleteTasks({
        type: FERTILIZE,
        taskIds: fertilizeTasks,
        date: date.toISOString()
      });
    },
    [bulkCompleteTasks, fertilizeTasks]
  );

  return (
    <>
      {tasks.length > 0 ? (
        <Box>
          <Typography
            variant="h6"
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>{title}</Box>
              <Box sx={{ display: 'flex', ml: 3, gap: 2 }}>
                {harvestTasks.length > 0 ? (
                  <Button
                    variant="outlined"
                    aria-label="harvest"
                    color="primary"
                    onClick={onHarvestClick}
                    title="Harvest"
                  >
                    <AgricultureIcon sx={{ mr: 1 }} fontSize="small" />
                    Harvest
                  </Button>
                ) : null}
                {fertilizeTasks.length > 0 ? (
                  <Button
                    variant="outlined"
                    aria-label="fertilize"
                    color="primary"
                    onClick={onFertilizeClick}
                    title="Fertilize"
                  >
                    <YardIcon sx={{ mr: 1 }} fontSize="small" />
                    Fertilize
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Typography>
          <Box component="nav" aria-label={`main tasks-${title}`}>
            <List>{tasks.map((task, index) => renderTask(task, index))}</List>
          </Box>
        </Box>
      ) : null}
      <DateDialog
        open={showHarvestedDialogue}
        question="When did you harvest?"
        label="Harvested On"
        onClose={() => setShowHarvestedDialogue(false)}
        onConfirm={finishUpdateStatusHarvested}
      />
      <DateDialog
        open={showFertilizedDialogue}
        question="When did you fertilize?"
        label="Fertilized On"
        onClose={() => setShowFertilizedDialogue(false)}
        onConfirm={finishUpdateStatusFertilized}
      />
    </>
  );
};

export default TasksSection;
