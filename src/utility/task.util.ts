import type { Task, TaskGroup } from '../interface';

export function createTaskGroups(tasks: Task[]): (Task | TaskGroup)[] {
  const customTasks = tasks.filter((task) => task.type === 'Custom');
  const taskGroups = Object.values(
    tasks
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

  return [...customTasks, ...taskGroups];
}
