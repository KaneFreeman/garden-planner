/**
 * Api operation to path mappings
 */
const enum Api {
  task_Get = 'GET:/task',
  task_IdGet = 'GET:/task/{taskId}',
  task_IdPut = 'PUT:/task/{taskId}',
  task_Post = 'POST:/task',
  task_IdDelete = 'DELETE:/task/{taskId}',

  plant_Get = 'GET:/plant',
  plant_IdGet = 'GET:/plant/{plantId}',
  plant_IdPut = 'PUT:/plant/{plantId}',
  plant_Post = 'POST:/plant',
  plant_IdDelete = 'DELETE:/plant/{plantId}',

  container_Get = 'GET:/container',
  container_IdGet = 'GET:/container/{containerId}',
  container_IdPut = 'PUT:/container/{containerId}',
  container_Post = 'POST:/container',
  container_IdDelete = 'DELETE:/container/{containerId}',

  picture_IdGet = 'GET:/picture/{pictureId}',
  picture_Post = 'POST:/picture',
  picture_IdDelete = 'DELETE:/picture/{pictureId}',
}

export default Api;
