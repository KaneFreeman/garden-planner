import React, { useCallback, useMemo } from 'react';
import format from 'date-fns/format';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Task } from '../../interface';
import { useTasksByPath } from '../useTasks';
import '../Tasks.css';

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

  const { tasks, completed, overdue, next, current } = useTasksByPath(path, -1);

  const renderTask = useCallback(
    (key: string, task: Task, index: number, options?: { showStart: boolean; style?: React.CSSProperties }) => {
      const { showStart = false, style } = options || {};

      let secondaryText: string;
      if (task.completedOn !== null) {
        secondaryText = `Completed ${format(task.completedOn, 'MMM d')}`;
      } else {
        secondaryText = `${showStart ? `Starts ${format(task.start, 'MMM d')}, ` : ''}Due ${format(task.due, 'MMM d')}`;
      }

      return (
        <ListItem className="task" style={style} key={`${key}-${index}`} disablePadding>
          <ListItemIcon>
            {task.completedOn !== null ? <CheckBoxIcon color="success" /> : <CheckBoxOutlineBlankIcon />}
          </ListItemIcon>
          <ListItemText
            primary={task.text}
            secondary={secondaryText}
            classes={{
              primary: 'textPrimary',
              secondary: 'textSecondary'
            }}
          />
        </ListItem>
      );
    },
    []
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
      <Box sx={{ width: '100%', ml: -2, mr: -2 }}>
        {tasks.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No tasks at this time!
          </Alert>
        ) : (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <List>
              {completed.map((task, index) => renderTask('completed', task, index))}
              {overdue.map((task, index) => renderTask('completed', task, index))}
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
