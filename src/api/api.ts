/**
 * Api operation to path mappings
 */
const enum Api {
  task_Get = 'GET:/task',
  task_IdGet = 'GET:/task/{taskId}',
  task_IdPut = 'PUT:/task/{taskId}',
  task_Post = 'POST:/task',
  task_IdDelete = 'DELETE:/task/{taskId}',
  task_PutBulkComplete = 'PUT:/task/bulk-complete',

  plant_Get = 'GET:/plant',
  plant_IdGet = 'GET:/plant/{plantId}',
  plant_IdPut = 'PUT:/plant/{plantId}',
  plant_Post = 'POST:/plant',
  plant_IdDelete = 'DELETE:/plant/{plantId}',

  plantInstance_Get = 'GET:/plant-instance',
  plantInstance_IdGet = 'GET:/plant-instance/{plantInstanceId}',
  plantInstance_IdPut = 'PUT:/plant-instance/{plantInstanceId}',
  plantInstance_Post = 'POST:/plant-instance',
  plantInstance_IdDelete = 'DELETE:/plant-instance/{plantInstanceId}',
  plantInstance_FertilizePost = 'POST:/plant-instance/{plantInstanceId}/fertilize',
  plantInstance_HarvestPost = 'POST:/plant-instance/{plantInstanceId}/harvest',

  container_Get = 'GET:/container',
  container_IdGet = 'GET:/container/{containerId}',
  container_IdPut = 'PUT:/container/{containerId}',
  container_Post = 'POST:/container',
  container_IdDelete = 'DELETE:/container/{containerId}',
  container_UpdateTasksPost = 'POST:/container/{containerId}/{taskType}',

  picture_IdGet = 'GET:/picture/{pictureId}',
  picture_Post = 'POST:/picture',
  picture_IdDelete = 'DELETE:/picture/{pictureId}',

  static_plantData_Get = 'GET:/static/plantData'
}

export default Api;
