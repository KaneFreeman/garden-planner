import React, { useCallback, useEffect, useMemo, useState } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import YardIcon from '@mui/icons-material/Yard';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrassIcon from '@mui/icons-material/Grass';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getMidnight } from '../utility/date.util';
import { CUSTOM, FERTILIZE, HARVEST, PLANT, Task } from '../interface';
import DateDialog from '../components/DateDialog';
import useSmallScreen from '../utility/smallScreen.util';
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
  disableSelect?: boolean;
}

const TasksSection = ({ title, tasks, options, disableSelect = false }: TasksSectionProps) => {
  const today = useMemo(() => getMidnight().getTime(), []);

  const bulkCompleteTasks = useBulkCompleteTasks();

  const [showPlantedDialogue, setShowPlantedDialogue] = useState(false);
  const [showHarvestedDialogue, setShowHarvestedDialogue] = useState(false);
  const [showFertilizedDialogue, setShowFertilizedDialogue] = useState(false);

  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const selectedTaskIds = useMemo(() => selectedTasks.map((task) => task._id), [selectedTasks]);

  const selecting = useMemo(() => selectedTasks.length > 0, [selectedTasks]);

  const [moreMenuAnchorElement, setMoreMenuAnchorElement] = React.useState<null | HTMLElement>(null);
  const moreMenuOpen = useMemo(() => Boolean(moreMenuAnchorElement), [moreMenuAnchorElement]);
  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorElement(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorElement(null);
  };

  const isSmallScreen = useSmallScreen();

  const handleOnSelect = useCallback(
    (task: Task, selected: boolean) => {
      if (disableSelect || task.type === CUSTOM) {
        return;
      }

      if (selected) {
        setSelectedTasks([...selectedTasks, task]);
      } else {
        const selectedIndex = selectedTaskIds.indexOf(task._id);
        if (selectedIndex > -1) {
          const newSelectedTasks = [...selectedTasks];
          newSelectedTasks.splice(selectedIndex, 1);
          setSelectedTasks(newSelectedTasks);
        }
      }
    },
    [disableSelect, selectedTaskIds, selectedTasks]
  );

  const handleOnClick = useCallback(
    (task: Task, selected: boolean) => {
      if (selecting && !disableSelect) {
        handleOnSelect(task, selected);
        return true;
      }

      return false;
    },
    [disableSelect, handleOnSelect, selecting]
  );

  useEffect(() => {
    handleMoreMenuClose();
  }, [isSmallScreen]);

  const renderTask = useCallback(
    (task: Task, index: number) => {
      const { showStart = false, isThisWeek = false, isOverdue = false, style } = options || {};
      const isSelected = selectedTaskIds.includes(task._id);
      return (
        <TaskListItem
          key={`${title}-${index}`}
          today={today}
          task={task}
          showStart={showStart}
          isThisWeek={isThisWeek}
          isOverdue={isOverdue}
          style={style}
          isSelected={isSelected}
          onClick={() => handleOnClick(task, !isSelected)}
          onSelect={() => handleOnSelect(task, !isSelected)}
          disableSelect={disableSelect}
        />
      );
    },
    [disableSelect, handleOnClick, handleOnSelect, options, selectedTaskIds, title, today]
  );

  const plantTasks = useMemo(
    () =>
      (selectedTasks?.length > 0 ? selectedTasks : tasks)
        .filter((task) => task.type === PLANT && today >= task.start.getTime())
        .map((task) => task._id),
    [selectedTasks, tasks, today]
  );

  const harvestTasks = useMemo(
    () =>
      (selectedTasks?.length > 0 ? selectedTasks : tasks)
        .filter((task) => task.type === HARVEST && today >= task.start.getTime())
        .map((task) => task._id),
    [selectedTasks, tasks, today]
  );

  const fertilizeTasks = useMemo(
    () =>
      (selectedTasks?.length > 0 ? selectedTasks : tasks)
        .filter((task) => task.type === FERTILIZE && today >= task.start.getTime())
        .map((task) => task._id),
    [selectedTasks, tasks, today]
  );

  const onPlantClick = useCallback(() => {
    setShowPlantedDialogue(true);
    setMoreMenuAnchorElement(null);
  }, []);

  const onHarvestClick = useCallback(() => {
    setShowHarvestedDialogue(true);
    setMoreMenuAnchorElement(null);
  }, []);

  const onFertilizeClick = useCallback(() => {
    setShowFertilizedDialogue(true);
    setMoreMenuAnchorElement(null);
  }, []);

  const finishUpdateStatusPlanted = useCallback(
    (date: Date) => {
      bulkCompleteTasks({
        type: PLANT,
        taskIds: plantTasks,
        date: date.toISOString()
      });
      if (selectedTasks?.length > 0) {
        setSelectedTasks(selectedTasks.filter((task) => !plantTasks.includes(task._id)));
      }
    },
    [bulkCompleteTasks, plantTasks, selectedTasks]
  );

  const finishUpdateStatusHarvested = useCallback(
    (date: Date) => {
      bulkCompleteTasks({
        type: HARVEST,
        taskIds: harvestTasks,
        date: date.toISOString()
      });
      if (selectedTasks?.length > 0) {
        setSelectedTasks(selectedTasks.filter((task) => !harvestTasks.includes(task._id)));
      }
    },
    [bulkCompleteTasks, harvestTasks, selectedTasks]
  );

  const finishUpdateStatusFertilized = useCallback(
    (date: Date) => {
      bulkCompleteTasks({
        type: FERTILIZE,
        taskIds: fertilizeTasks,
        date: date.toISOString()
      });
      if (selectedTasks?.length > 0) {
        setSelectedTasks(selectedTasks.filter((task) => !fertilizeTasks.includes(task._id)));
      }
    },
    [bulkCompleteTasks, fertilizeTasks, selectedTasks]
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSmallScreen ? 'space-between' : undefined
              }}
            >
              <Box
                sx={{
                  height: 36.5,
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {title}
              </Box>
              {isSmallScreen ? (
                <Box key="small-screen-actions" sx={{ display: 'flex', height: 40 }}>
                  {plantTasks.length > 0 || harvestTasks.length > 0 || fertilizeTasks.length > 0 ? (
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
                        {plantTasks.length > 0 ? (
                          <MenuItem onClick={onPlantClick}>
                            <ListItemIcon>
                              <GrassIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="success.main">Plant</Typography>
                          </MenuItem>
                        ) : null}
                        {harvestTasks.length > 0 ? (
                          <MenuItem onClick={onHarvestClick}>
                            <ListItemIcon>
                              <AgricultureIcon color="secondary" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="secondary.main">Harvest</Typography>
                          </MenuItem>
                        ) : null}
                        {fertilizeTasks.length > 0 ? (
                          <MenuItem onClick={onFertilizeClick}>
                            <ListItemIcon>
                              <YardIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="primary.main">Fertilize</Typography>
                          </MenuItem>
                        ) : null}
                      </Menu>
                    </>
                  ) : null}
                </Box>
              ) : (
                <Box key="large-screen-actions" sx={{ display: 'flex', ml: 3, gap: 2 }}>
                  {plantTasks.length > 0 ? (
                    <Button variant="outlined" aria-label="plant" color="success" onClick={onPlantClick} title="Plant">
                      <GrassIcon sx={{ mr: 1 }} fontSize="small" />
                      Plant
                    </Button>
                  ) : null}
                  {harvestTasks.length > 0 ? (
                    <Button
                      variant="outlined"
                      aria-label="harvest"
                      color="secondary"
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
              )}
            </Box>
          </Typography>
          <Box component="nav" aria-label={`main tasks-${title}`}>
            <List>{tasks.map((task, index) => renderTask(task, index))}</List>
          </Box>
        </Box>
      ) : null}
      <DateDialog
        open={showPlantedDialogue}
        question="When did you plant?"
        label="Planted On"
        onClose={() => setShowPlantedDialogue(false)}
        onConfirm={finishUpdateStatusPlanted}
      />
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
