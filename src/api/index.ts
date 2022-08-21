/* eslint-disable @typescript-eslint/ban-types */
import {
  TaskDTO,
  PlantDTO,
  ContainerDTO,
  PictureDTO,
  PlantType,
  PlantDataDTO,
  PlantInstanceDTO,
  PlantInstanceAddHistoryAndUpdateTaskDTO,
  BulkCompleteTaskDTO,
  ContainerTaskUpdateDTO
} from '../interface';

interface Rest {
  'GET:/task': {
    method: 'GET';
    request: {
      query?: {
        path?: string;
      };
    };
    response: TaskDTO[];
  };
  'POST:/task': {
    method: 'POST';
    request: {
      body: Omit<TaskDTO, '_id'>;
    };
    response: TaskDTO;
  };
  'GET:/task/{taskId}': {
    method: 'GET';
    request: {
      params: {
        taskId: string;
      };
    };
    response: TaskDTO;
  };
  'PUT:/task/{taskId}': {
    method: 'PUT';
    request: {
      params: {
        taskId: string;
      };
      body: Omit<TaskDTO, '_id'>;
    };
    response: TaskDTO;
  };
  'DELETE:/task/{taskId}': {
    method: 'DELETE';
    request: {
      params: {
        taskId: string;
      };
    };
    response: TaskDTO;
  };
  'PUT:/task/bulk-complete': {
    method: 'PUT';
    request: {
      body: BulkCompleteTaskDTO;
    };
    response: number;
  };
  'GET:/plant': {
    method: 'GET';
    request: {};
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
  'GET:/container': {
    method: 'GET';
    request: {};
    response: ContainerDTO[];
  };
  'POST:/container': {
    method: 'POST';
    request: {
      body: Omit<ContainerDTO, '_id'>;
    };
    response: ContainerDTO;
  };
  'POST:/container/{containerId}/{taskType}': {
    method: 'POST';
    request: {
      params: {
        containerId: string;
        taskType: string;
      };
      body: ContainerTaskUpdateDTO;
    };
    response: ContainerDTO;
  };
  'GET:/container/{containerId}': {
    method: 'GET';
    request: {
      params: {
        containerId: string;
      };
    };
    response: ContainerDTO;
  };
  'PUT:/container/{containerId}': {
    method: 'PUT';
    request: {
      params: {
        containerId: string;
      };
      body: Omit<ContainerDTO, '_id'>;
    };
    response: ContainerDTO;
  };
  'DELETE:/container/{containerId}': {
    method: 'DELETE';
    request: {
      params: {
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
    request: {};
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
  'GET:/plant-instance': {
    method: 'GET';
    request: {};
    response: PlantInstanceDTO[];
  };
  'POST:/plant-instance': {
    method: 'POST';
    request: {
      body: Omit<PlantInstanceDTO, '_id'>;
    };
    response: PlantInstanceDTO;
  };
  'GET:/plant-instance/{plantInstanceId}': {
    method: 'GET';
    request: {
      params: {
        plantInstanceId: string;
      };
    };
    response: PlantInstanceDTO;
  };
  'PUT:/plant-instance/{plantInstanceId}': {
    method: 'PUT';
    request: {
      params: {
        plantInstanceId: string;
      };
      body: Omit<PlantInstanceDTO, '_id'>;
    };
    response: PlantInstanceDTO;
  };
  'DELETE:/plant-instance/{plantInstanceId}': {
    method: 'DELETE';
    request: {
      params: {
        plantInstanceId: string;
      };
    };
    response: PlantInstanceDTO;
  };
  'POST:/plant-instance/{plantInstanceId}/fertilize': {
    method: 'POST';
    request: {
      params: {
        plantInstanceId: string;
      };
      body: PlantInstanceAddHistoryAndUpdateTaskDTO;
    };
    response: PlantInstanceDTO;
  };
  'POST:/plant-instance/{plantInstanceId}/harvest': {
    method: 'POST';
    request: {
      params: {
        plantInstanceId: string;
      };
      body: PlantInstanceAddHistoryAndUpdateTaskDTO;
    };
    response: PlantInstanceDTO;
  };
}

export default Rest;
