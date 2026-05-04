import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useAppSelector } from '../store/hooks';
import { selectSelectedGarden } from '../store/slices/gardens';
import { selectRealtimeBootstrapComplete } from '../store/slices/global';
import { useGetTasks, useTask } from './hooks/useTasks';
import TaskView from './TaskView';

const TaskViewRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const debugEnabled = import.meta.env.DEV;

  const selectedGarden = useAppSelector(selectSelectedGarden);
  const realtimeBootstrapComplete = useAppSelector(selectRealtimeBootstrapComplete);
  const task = useTask(id);
  const getTasks = useGetTasks({ force: true });
  const [isRecoveringTask, setIsRecoveringTask] = useState(false);
  const taskLookupAttemptRef = useRef<string | null>(null);
  const taskLookupKey = id && selectedGarden?._id ? `${selectedGarden._id}:${id}` : null;
  const taskLookupComplete = taskLookupKey !== null && taskLookupAttemptRef.current === taskLookupKey;

  useEffect(() => {
    if (!debugEnabled) {
      return;
    }

    console.debug('[task-route] state', {
      id,
      selectedGardenId: selectedGarden?._id,
      realtimeBootstrapComplete,
      hasTask: Boolean(task),
      isRecoveringTask,
      taskLookupComplete
    });
  }, [debugEnabled, id, isRecoveringTask, realtimeBootstrapComplete, selectedGarden?._id, task, taskLookupComplete]);

  useEffect(() => {
    if (!id || !selectedGarden?._id || !realtimeBootstrapComplete || task || isRecoveringTask || taskLookupComplete) {
      return;
    }

    let alive = true;

    const recoverTask = async () => {
      if (debugEnabled) {
        console.debug('[task-route] recover:start', {
          id,
          selectedGardenId: selectedGarden._id
        });
      }

      setIsRecoveringTask(true);

      try {
        await getTasks();
      } finally {
        if (debugEnabled) {
          console.debug('[task-route] recover:complete', {
            id,
            selectedGardenId: selectedGarden._id
          });
        }

        if (alive) {
          taskLookupAttemptRef.current = taskLookupKey;
          setIsRecoveringTask(false);
        }
      }
    };

    void recoverTask();

    return () => {
      alive = false;
    };
  }, [
    debugEnabled,
    getTasks,
    id,
    isRecoveringTask,
    realtimeBootstrapComplete,
    selectedGarden?._id,
    task,
    taskLookupComplete,
    taskLookupKey
  ]);

  if (!realtimeBootstrapComplete || isRecoveringTask) {
    return <Loading />;
  }

  if (!task) {
    return (
      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Task not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          This task is not available in the currently selected garden.
        </Typography>
        <Button color="secondary" variant="contained" onClick={() => navigate('/')}>
          Back to tasks
        </Button>
      </div>
    );
  }

  return <TaskView task={task} />;
};

export default TaskViewRoute;
