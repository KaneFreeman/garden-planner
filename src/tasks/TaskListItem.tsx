/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Task } from '../interface';
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

  return (
    <ListItem style={style} className="task" disablePadding>
      <ListItemButton
        onClick={onClickHandler}
        sx={{
          width: '100%'
        }}
      >
        <ListItemIcon>
          {task.completedOn !== null ? <CheckBoxIcon color="success" /> : <CheckBoxOutlineBlankIcon />}
        </ListItemIcon>
        {isThisWeek ? <WarningIcon sx={{ mr: 1 }} color="warning" /> : null}
        {isOverdue ? <ErrorIcon sx={{ mr: 1 }} color="error" /> : null}
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
