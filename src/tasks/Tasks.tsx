import React, { useCallback, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTasks } from './useTasks';
import Tabs from '../components/tabs/Tabs';
import TabPanel from '../components/tabs/TabPanel';
import { Task } from '../interface';
import './Tasks.css';
import TaskListItem from './TaskListItem';

const Tasks = () => {
  const [tab, setTab] = useState(0);

  const { tasks, completed, overdue, next, current } = useTasks();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const renderTask = useCallback(
    (
      key: string,
      task: Task,
      index: number,
      options?: { showStart?: boolean; isOverdue?: boolean; style?: React.CSSProperties }
    ) => {
      const { showStart = false, isOverdue = false, style } = options || {};
      return (
        <TaskListItem
          key={`${key}-${index}`}
          today={today}
          task={task}
          showStart={showStart}
          isOverdue={isOverdue}
          style={style}
        />
      );
    },
    [today]
  );

  const renderVirtualTask = useCallback(
    (key: string, tasksToRender: Task[], showStart = false) =>
      ({ index, style }: ListChildComponentProps) =>
        renderTask(key, tasksToRender[index], index, { showStart, style }),
    [renderTask]
  );

  return (
    <Box sx={{ width: '100%' }}>
      {tasks.length === 0 ? (
        <Alert severity="info" sx={{ m: 2 }}>
          No tasks at this time!
        </Alert>
      ) : (
        <>
          <Tabs ariaLabel="tasks tabs" onChange={(newTab) => setTab(newTab)} sxRoot={{ top: 56 }}>
            {{
              label: 'Open'
            }}
            {{
              label: 'Completed'
            }}
          </Tabs>
          <TabPanel value={tab} index={0}>
            {overdue.length > 0 || current.length > 0 || next.length > 0 ? (
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {overdue.length > 0 ? (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      Overdue
                    </Typography>
                    <Box component="nav" aria-label="main tasks-overdue">
                      <List>
                        {overdue.map((task, index) => renderTask('overdue', task, index, { isOverdue: true }))}
                      </List>
                    </Box>
                  </Box>
                ) : null}
                {current.length > 0 ? (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      Current
                    </Typography>
                    <Box component="nav" aria-label="main tasks-current">
                      <List>{current.map((task, index) => renderTask('current', task, index))}</List>
                    </Box>
                  </Box>
                ) : null}
                {next.length > 0 ? (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      Next 30 Days
                    </Typography>
                    <Box component="nav" aria-label="main tasks-future">
                      <List>
                        {next.map((task, index) => renderTask('next-30-days', task, index, { showStart: true }))}
                      </List>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            ) : (
              <Alert severity="info" sx={{ m: 2 }}>
                No open tasks at this time!
              </Alert>
            )}
          </TabPanel>
          <TabPanel value={tab} index={1} sx={{ overflow: 'hidden', height: 'calc(100vh - 113px)' }}>
            {completed.length > 0 ? (
              <Box sx={{ pl: 2, pr: 2, boxSizing: 'border-box', height: '100%' }}>
                <Box
                  component="nav"
                  aria-label="main tasks-complete"
                  sx={{ boxSizing: 'border-box', height: '100%', mr: -2 }}
                >
                  <AutoSizer>
                    {({ height, width }) => (
                      <FixedSizeList
                        height={height}
                        width={width}
                        itemSize={72}
                        itemCount={completed.length}
                        overscanCount={5}
                      >
                        {renderVirtualTask('completed', completed)}
                      </FixedSizeList>
                    )}
                  </AutoSizer>
                </Box>
              </Box>
            ) : (
              <Alert severity="info" sx={{ m: 2 }}>
                No completed tasks at this time!
              </Alert>
            )}
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default Tasks;
