import {
  BulkCompleteTaskDTO,
  BulkReopenClosePlantInstanceDTO,
  ContainerDTO,
  ContainerTaskUpdateDTO,
  GardenDTO,
  GenerateTokenDTO,
  LoginDTO,
  PictureDTO,
  PlantDTO,
  PlantDataDTO,
  PlantInstanceAddHistoryAndUpdateTaskDTO,
  PlantInstanceDTO,
  PlantType,
  SessionDTO,
  TaskDTO,
  UserDTO,
  ValidateTokenDTO
} from '../interface';

interface Rest {
  'POST:/auth/login': {
    method: 'POST';
    request: {
      body: LoginDTO;
    };
    response: SessionDTO;
  };
  'GET:/auth/profile': {
    method: 'GET';
    request: {
      query?: {
        path?: string;
      };
    };
    response: Omit<SessionDTO, 'accessToken'>;
  };
  'POST:/auth/token/generate': {
    method: 'POST';
    request: {
      body: GenerateTokenDTO;
    };
    response: { status?: 'success'; message?: string };
  };
  'POST:/auth/token/validate': {
    method: 'POST';
    request: {
      body: ValidateTokenDTO;
    };
    response: SessionDTO;
  };

  'GET:/user': {
    method: 'GET';
    request: Record<string, never>;
    response: UserDTO;
  };
  'POST:/user': {
    method: 'POST';
    request: {
      body: UserDTO;
    };
    response: { status?: 'success'; message?: string };
  };
  'PUT:/user': {
    method: 'PUT';
    request: {
      body: UserDTO;
    };
    response: UserDTO;
  };

  'GET:/garden': {
    method: 'GET';
    request: Record<string, never>;
    response: GardenDTO[];
  };
  'POST:/garden': {
    method: 'POST';
    request: {
      body: Omit<GardenDTO, '_id'>;
    };
    response: GardenDTO;
  };
  'GET:/garden/{gardenId}': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
      };
    };
    response: GardenDTO;
  };
  'PUT:/garden/{gardenId}': {
    method: 'PUT';
    request: {
      params: {
        gardenId: string;
      };
      body: Omit<GardenDTO, '_id'>;
    };
    response: GardenDTO;
  };
  'DELETE:/garden/{gardenId}': {
    method: 'DELETE';
    request: {
      params: {
        gardenId: string;
      };
    };
    response: GardenDTO;
  };

  'GET:/garden/{gardenId}/task': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
      };
      query?: {
        path?: string;
      };
    };
    response: TaskDTO[];
  };
  'POST:/garden/{gardenId}/task': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
      };
      body: Omit<TaskDTO, '_id'>;
    };
    response: TaskDTO;
  };
  'GET:/garden/{gardenId}/task/{taskId}': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
        taskId: string;
      };
    };
    response: TaskDTO;
  };
  'PUT:/garden/{gardenId}/task/{taskId}': {
    method: 'PUT';
    request: {
      params: {
        gardenId: string;
        taskId: string;
      };
      body: Omit<TaskDTO, '_id'>;
    };
    response: TaskDTO;
  };
  'DELETE:/garden/{gardenId}/task/{taskId}': {
    method: 'DELETE';
    request: {
      params: {
        gardenId: string;
        taskId: string;
      };
    };
    response: TaskDTO;
  };
  'PUT:/garden/{gardenId}/task/bulk-complete': {
    method: 'PUT';
    request: {
      params: {
        gardenId: string;
      };
      body: BulkCompleteTaskDTO;
    };
    response: number;
  };
  'GET:/plant': {
    method: 'GET';
    request: Record<string, never>;
    response: PlantDTO[];
  };
  'POST:/plant': {
    method: 'POST';
    request: {
      body: Omit<PlantDTO, '_id'>;
    };
    response: PlantDTO;
  };
  'GET:/plant/{plantId}': {
    method: 'GET';
    request: {
      params: {
        plantId: string;
      };
    };
    response: PlantDTO;
  };
  'PUT:/plant/{plantId}': {
    method: 'PUT';
    request: {
      params: {
        plantId: string;
      };
      body: Omit<PlantDTO, '_id'>;
    };
    response: PlantDTO;
  };
  'DELETE:/plant/{plantId}': {
    method: 'DELETE';
    request: {
      params: {
        plantId: string;
      };
    };
    response: PlantDTO;
  };
  'GET:/garden/{gardenId}/container': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
      };
    };
    response: ContainerDTO[];
  };
  'POST:/garden/{gardenId}/container': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
      };
      body: Omit<ContainerDTO, '_id'>;
    };
    response: ContainerDTO;
  };
  'POST:/garden/{gardenId}/container/{containerId}/{taskType}': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
        containerId: string;
        taskType: string;
      };
      body: ContainerTaskUpdateDTO;
    };
    response: ContainerDTO;
  };
  'GET:/garden/{gardenId}/container/{containerId}': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
        containerId: string;
      };
    };
    response: ContainerDTO;
  };
  'PUT:/garden/{gardenId}/container/{containerId}': {
    method: 'PUT';
    request: {
      params: {
        gardenId: string;
        containerId: string;
      };
      body: Omit<ContainerDTO, '_id'>;
    };
    response: ContainerDTO;
  };
  'DELETE:/garden/{gardenId}/container/{containerId}': {
    method: 'DELETE';
    request: {
      params: {
        gardenId: string;
        containerId: string;
      };
    };
    response: ContainerDTO;
  };
  'POST:/picture': {
    method: 'POST';
    request: {
      body: Omit<PictureDTO, '_id'>;
    };
    response: PictureDTO;
  };
  'GET:/picture/{pictureId}': {
    method: 'GET';
    request: {
      params: {
        pictureId: string;
      };
    };
    response: PictureDTO;
  };
  'DELETE:/picture/{pictureId}': {
    method: 'DELETE';
    request: {
      params: {
        pictureId: string;
      };
    };
    response: PictureDTO;
  };
  'GET:/static/plantData': {
    method: 'GET';
    request: Record<string, never>;
    response: Record<PlantType, PlantDataDTO>;
  };
  'GET:/static/plantData/{plantType}': {
    method: 'GET';
    request: {
      params: {
        plantType: string;
      };
    };
    response: PlantDataDTO | null;
  };
  'GET:/garden/{gardenId}/plant-instance': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
      };
    };
    response: PlantInstanceDTO[];
  };
  'POST:/garden/{gardenId}/plant-instance': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
      };
      body: Omit<PlantInstanceDTO, '_id'>;
      query?: {
        copiedFromId?: string;
      };
    };
    response: PlantInstanceDTO;
  };
  'GET:/garden/{gardenId}/plant-instance/{plantInstanceId}': {
    method: 'GET';
    request: {
      params: {
        gardenId: string;
        plantInstanceId: string;
      };
    };
    response: PlantInstanceDTO;
  };
  'PUT:/garden/{gardenId}/plant-instance/{plantInstanceId}': {
    method: 'PUT';
    request: {
      params: {
        gardenId: string;
        plantInstanceId: string;
      };
      body: Omit<PlantInstanceDTO, '_id'>;
    };
    response: PlantInstanceDTO;
  };
  'DELETE:/garden/{gardenId}/plant-instance/{plantInstanceId}': {
    method: 'DELETE';
    request: {
      params: {
        gardenId: string;
        plantInstanceId: string;
      };
    };
    response: PlantInstanceDTO;
  };
  'POST:/garden/{gardenId}/plant-instance/{plantInstanceId}/fertilize': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
        plantInstanceId: string;
      };
      body: PlantInstanceAddHistoryAndUpdateTaskDTO;
    };
    response: PlantInstanceDTO;
  };
  'POST:/garden/{gardenId}/plant-instance/{plantInstanceId}/harvest': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
        plantInstanceId: string;
      };
      body: PlantInstanceAddHistoryAndUpdateTaskDTO;
    };
    response: PlantInstanceDTO;
  };
  'POST:/garden/{gardenId}/plant-instance/bulk-reopen-close': {
    method: 'POST';
    request: {
      params: {
        gardenId: string;
      };
      body: BulkReopenClosePlantInstanceDTO;
    };
    response: PlantInstanceDTO[];
  };
}

export default Rest;
