import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useTask } from './hooks/useTasks';
import TaskView from './TaskView';

const TaskViewRoute = () => {
  const { id } = useParams();

  const task = useTask(id);

  if (!task) {
    return <Loading />;
  }

  return <TaskView task={task} />;
};

export default TaskViewRoute;
