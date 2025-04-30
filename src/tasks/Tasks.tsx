import React, { useCallback, useMemo, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Tabs from '../components/tabs/Tabs';
import TabPanel from '../components/tabs/TabPanel';
import AutoSizer from '../components/AutoSizer';
import { getMidnight } from '../utility/date.util';
import { Task, TaskGroup } from '../interface';
import { useTasks } from './hooks/useTasks';
import TaskListItem from './TaskListItem';
import TasksSection from './TasksSection';
import './Tasks.css';

const Tasks = () => {
  const [tab, setTab] = useState(0);

  const { tasks, completed, overdue, next, active, thisWeek } = useTasks();

  const today = useMemo(() => getMidnight().getTime(), []);

  const renderTask = useCallback(
    (
      key: string,
      task: Task | TaskGroup,
      index: number,
      options?: { showStart?: boolean; isThisWeek?: boolean; isOverdue?: boolean; style?: React.CSSProperties }
    ) => {
      const { showStart = false, isThisWeek = false, isOverdue = false, style } = options || {};
      return (
        <TaskListItem
          key={`${key}-${index}`}
          today={today}
          task={task}
          showStart={showStart}
          isThisWeek={isThisWeek}
          isOverdue={isOverdue}
          style={style}
        />
      );
    },
    [today]
  );

  const completedTasks = useMemo(() => {
    const completedCustomTasks = completed.filter((task) => task.type === 'Custom');
    const completedTaskGroups = Object.values(
      completed
        .filter((task) => task.type !== 'Custom')
        .reduce<Record<string, TaskGroup>>((acc, task) => {
          const key = `taskGroup-${task.path}_${task.type}_${task.text}_${task.start}_${task.due}_${task.completedOn}`;
          if (!(key in acc)) {
            acc[key] = {
              key,
              path: task.path,
              type: task.type,
              text: task.text,
              start: task.start,
              due: task.due,
              completedOn: task.completedOn,
              instances: []
            };
          }

          acc[key].instances.push({
            _id: task._id,
            plantInstanceId: task.plantInstanceId
          });

          return acc;
        }, {})
    );

    const data = [...completedCustomTasks, ...completedTaskGroups];

    data.sort((a, b) => b.completedOn!.getTime() - a.completedOn!.getTime());

    return data;
  }, [completed]);

  const renderVirtualTask = useCallback(
    (key: string, tasksToRender: (Task | TaskGroup)[], showStart = false) =>
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
            {overdue.length > 0 || thisWeek.length > 0 || active.length > 0 || next.length > 0 ? (
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TasksSection title="Overdue" tasks={overdue} options={{ isOverdue: true }} />
                <TasksSection title="This Week" tasks={thisWeek} options={{ isThisWeek: true }} />
                <TasksSection title="Active" tasks={active} />
                <TasksSection title="Next 30 Days" tasks={next} options={{ showStart: true }} disableSelect />
              </Box>
            ) : (
              <Alert severity="info" sx={{ m: 2 }}>
                No open tasks at this time!
              </Alert>
            )}
          </TabPanel>
          <TabPanel value={tab} index={1} sx={{ overflow: 'hidden', height: 'calc(100dvh - 106px)' }}>
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
                        {renderVirtualTask('completed', completedTasks)}
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
