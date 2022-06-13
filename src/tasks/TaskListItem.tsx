/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import { blue, green, red } from '@mui/material/colors';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import GrassIcon from '@mui/icons-material/Grass';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import YardIcon from '@mui/icons-material/Yard';
import { FERTILIZE, HARVEST, PLANT, Task, TRANSPLANT } from '../interface';
import useGetTaskText from './hooks/useGetTaskText';
import './Tasks.css';

interface TaskListItemProps {
  today: number;
  task: Task;
  showStart?: boolean;
  isThisWeek?: boolean;
  isOverdue?: boolean;
  style?: React.CSSProperties;
  back?: {
    path: string;
    title: string;
  };
}

const TaskListItem = ({
  today,
  task,
  showStart = false,
  isThisWeek = false,
  isOverdue = false,
  style,
  back
}: TaskListItemProps) => {
  const navigate = useNavigate();

  const queryString = useMemo(() => {
    if (!back) {
      return '';
    }

    return `?backPath=${back.path}&backLabel=${back.title}`;
  }, [back]);

  const onClickHandler = useCallback(() => {
    navigate(`/task/${task._id}${queryString}`);
  }, [navigate, task._id, queryString]);

  const { primary, secondary } = useGetTaskText(task, today, showStart);

  const [avatarBgColor, avatarIcon] = useMemo(() => {
    switch (task.type) {
      case FERTILIZE:
        return [blue[500], <YardIcon key="fertilize task icon" />];
      case HARVEST:
        return [blue[500], <AgricultureIcon key="harvest task icon" />];
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

  return (
    <ListItem style={style} className="task" disablePadding>
      <ListItemButton
        onClick={onClickHandler}
        sx={{
          width: '100%'
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: avatarBgColor }}>{avatarIcon}</Avatar>
        </ListItemAvatar>
        {isThisWeek ? <WarningIcon sx={{ mr: 2 }} color="warning" /> : null}
        {isOverdue ? <ErrorIcon sx={{ mr: 2 }} color="error" /> : null}
        <ListItemText
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
