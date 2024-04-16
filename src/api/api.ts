/**
 * Api operation to path mappings
 */
const enum Api {
  auth_PostLogin = 'POST:/auth/login',
  auth_GetProfile = 'GET:/auth/profile',

  auth_token_PostGenerateToken = 'POST:/auth/token/generate',
  auth_token_PostValidateToken = 'POST:/auth/token/validate',

  user_Post = 'POST:/user',

  garden_Get = 'GET:/garden',
  garden_IdGet = 'GET:/garden/{gardenId}',
  garden_IdPut = 'PUT:/garden/{gardenId}',
  garden_Post = 'POST:/garden',
  garden_IdDelete = 'DELETE:/garden/{gardenId}',

  task_Get = 'GET:/garden/{gardenId}/task',
  task_IdGet = 'GET:/garden/{gardenId}/task/{taskId}',
  task_IdPut = 'PUT:/garden/{gardenId}/task/{taskId}',
  task_Post = 'POST:/garden/{gardenId}/task',
  task_IdDelete = 'DELETE:/garden/{gardenId}/task/{taskId}',
  task_PutBulkComplete = 'PUT:/garden/{gardenId}/task/bulk-complete',

  plant_Get = 'GET:/plant',
  plant_IdGet = 'GET:/plant/{plantId}',
  plant_IdPut = 'PUT:/plant/{plantId}',
  plant_Post = 'POST:/plant',
  plant_IdDelete = 'DELETE:/plant/{plantId}',

  plantInstance_Get = 'GET:/garden/{gardenId}/plant-instance',
  plantInstance_IdGet = 'GET:/garden/{gardenId}/plant-instance/{plantInstanceId}',
  plantInstance_IdPut = 'PUT:/garden/{gardenId}/plant-instance/{plantInstanceId}',
  plantInstance_Post = 'POST:/garden/{gardenId}/plant-instance',
  plantInstance_IdDelete = 'DELETE:/garden/{gardenId}/plant-instance/{plantInstanceId}',
  plantInstance_FertilizePost = 'POST:/garden/{gardenId}/plant-instance/{plantInstanceId}/fertilize',
  plantInstance_HarvestPost = 'POST:/garden/{gardenId}/plant-instance/{plantInstanceId}/harvest',
  plantInstance_BulkReopenClose = 'POST:/garden/{gardenId}/plant-instance/bulk-reopen-close',

  container_Get = 'GET:/garden/{gardenId}/container',
  container_IdGet = 'GET:/garden/{gardenId}/container/{containerId}',
  container_IdPut = 'PUT:/garden/{gardenId}/container/{containerId}',
  container_Post = 'POST:/garden/{gardenId}/container',
  container_IdDelete = 'DELETE:/garden/{gardenId}/container/{containerId}',
  container_UpdateTasksPost = 'POST:/garden/{gardenId}/container/{containerId}/{taskType}',

  picture_IdGet = 'GET:/picture/{pictureId}',
  picture_Post = 'POST:/picture',
  picture_IdDelete = 'DELETE:/picture/{pictureId}',

  static_plantData_Get = 'GET:/static/plantData'
}

export default Api;
