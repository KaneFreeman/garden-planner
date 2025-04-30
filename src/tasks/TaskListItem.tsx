import AgricultureIcon from '@mui/icons-material/Agriculture';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import GrassIcon from '@mui/icons-material/Grass';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import TaskIcon from '@mui/icons-material/Task';
import WarningIcon from '@mui/icons-material/Warning';
import YardIcon from '@mui/icons-material/Yard';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import { blue, green, purple, red } from '@mui/material/colors';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useCallback, useMemo } from 'react';
import { CUSTOM, FERTILIZE, HARVEST, PLANT, Task, TaskGroup, TRANSPLANT } from '../interface';
import useSmallScreen from '../utility/smallScreen.util';
import useGetTaskText from './hooks/useGetTaskText';
import './Tasks.css';

interface TaskListItemProps {
  today: number;
  task: Task | TaskGroup;
  showStart?: boolean;
  isThisWeek?: boolean;
  isOverdue?: boolean;
  style?: React.CSSProperties;
  back?: {
    path: string;
    title: string;
  };
  isSelected?: boolean;
  disableSelect?: boolean;
  disabled?: boolean;
  onClick?: () => boolean;
  onSelect?: () => void;
}

const TaskListItem = ({
  today,
  task,
  showStart = false,
  isThisWeek = false,
  isOverdue = false,
  style,
  back,
  isSelected = false,
  disableSelect = false,
  disabled = false,
  onClick,
  onSelect
}: TaskListItemProps) => {
  const isSmallScreen = useSmallScreen();

  const queryString = useMemo(() => {
    if (!back) {
      return '';
    }

    return `?backPath=${back.path}&backLabel=${back.title}`;
  }, [back]);

  const onSelectHandler = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (disableSelect) {
        return;
      }

      if (onSelect) {
        onSelect();
      }
    },
    [disableSelect, onSelect]
  );

  const href = useMemo(() => {
    if ('_id' in task) {
      return `/task/${task._id}${queryString}`;
    } else if (task.path) {
      return task.path;
    }

    return undefined;
  }, [queryString, task]);

  const onClickHandler = useCallback(() => {
    if (onClick) {
      if (onClick()) {
        return;
      }
    }
  }, [onClick]);

  const { primary, secondary } = useGetTaskText(task, today, showStart);

  const [avatarBgColor, avatarIcon] = useMemo(() => {
    switch (task.type) {
      case FERTILIZE:
        return [blue[500], <YardIcon key="fertilize task icon" />];
      case HARVEST:
        return [purple[300], <AgricultureIcon key="harvest task icon" />];
      case PLANT:
        return [green[500], <GrassIcon key="plant task icon" />];
      case TRANSPLANT:
        return [red[500], <MoveDownIcon key="transplatn task icon" />];
      default:
        return task.completedOn !== null
          ? [green[500], <TaskIcon key="completed custom task icon" />]
          : [undefined, <AssignmentIcon key="custom task icon" />];
    }
  }, [task.completedOn, task.type]);

  const labelId = useMemo(() => `task-checkbox-list-label-${'_id' in task ? task._id : task.key}`, [task]);

  return (
    <ListItem style={style} className="task" disablePadding>
      <ListItemButton
        onClick={onClickHandler}
        component={!disabled ? 'a' : 'div'}
        href={!disabled ? href : undefined}
        disabled={disabled}
        onContextMenu={isSmallScreen ? onSelectHandler : undefined}
        sx={{
          width: '100%',
          '&.Mui-disabled': {
            opacity: 1
          }
        }}
        selected={isSelected}
      >
        {!isSmallScreen && task.completedOn === null && task.type !== CUSTOM && !disableSelect ? (
          <Checkbox
            edge="start"
            checked={isSelected}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={onSelectHandler}
          />
        ) : null}
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: isSmallScreen && isSelected ? green[500] : avatarBgColor }}>
            {isSmallScreen && isSelected ? <CheckIcon key="selected task icon" /> : avatarIcon}
          </Avatar>
        </ListItemAvatar>
        {isThisWeek ? <WarningIcon sx={{ mr: 2 }} color="warning" /> : null}
        {isOverdue ? <ErrorIcon sx={{ mr: 2 }} color="error" /> : null}
        <ListItemText
          id={labelId}
          primary={primary}
          secondary={secondary}
          classes={{
            primary: 'textPrimary',
            secondary: 'textSecondary'
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default TaskListItem;
