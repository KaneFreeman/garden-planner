import { useCallback, useEffect, useMemo, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useGetUser } from '../account/useUser';
import { type ExtraFetchOptions } from '../api/useFetch';
import { useGetContainers } from '../containers/hooks/useContainers';
import { useGetGardens } from '../gardens/useGardens';
import { useGetPlantData } from '../hooks/useStaticData';
import {
  ContainerDTO,
  Garden,
  PictureDTO,
  PlantDTO,
  PlantDataDTO,
  PlantInstanceDTO,
  PlantType,
  TaskDTO,
  UserDTO
} from '../interface';
import { useGetPlantInstances } from '../plant-instances/hooks/usePlantInstances';
import { useGetPlants } from '../plants/usePlants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateContainers } from '../store/slices/containers';
import { selectSelectedGarden, updateGardens } from '../store/slices/gardens';
import {
  resetRealtimeState,
  setBrowserOnline,
  setRealtimeBootstrapState,
  setRealtimeConnected,
  setRealtimeLastError
} from '../store/slices/global';
import { clearPicture, updatePicture } from '../store/slices/pictures';
import { updatePlantInstances } from '../store/slices/plant-instances';
import { updatePlants } from '../store/slices/plants';
import { updatePlantData } from '../store/slices/static';
import { selectUser } from '../store/slices/auth';
import { updateUserDetails } from '../store/slices/auth';
import { updateTasks } from '../store/slices/tasks';
import { useGetTasks } from '../tasks/hooks/useTasks';
import { REALTIME_EVENTS, REALTIME_PATH, getRealtimeServerUrl } from './realtime';

type RealtimeSyncEnvelope = {
  data?: {
    gardenId?: string;
    gardens?: Garden[];
    plants?: PlantDTO[];
    plantData?: Record<PlantType, PlantDataDTO>;
    picture?: PictureDTO;
    deletedPictureId?: string;
    containers?: ContainerDTO[];
    plantInstances?: PlantInstanceDTO[];
    tasks?: TaskDTO[];
    userDetails?: UserDTO;
  };
};

export const useRealtimeSync = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const selectedGarden = useAppSelector(selectSelectedGarden);
  const debugEnabled = import.meta.env.DEV;
  const socketRef = useRef<Socket | null>(null);
  const selectedGardenIdRef = useRef<string | undefined>(selectedGarden?._id);
  const refreshUserScopeRef = useRef<() => Promise<void>>(async () => undefined);
  const refreshGardenScopeRef = useRef<(gardenId?: string) => Promise<void>>(async () => undefined);
  const forceFetchOptions = useMemo<ExtraFetchOptions>(() => ({ force: true }), []);

  const debug = useCallback(
    (message: string, details?: Record<string, unknown>) => {
      if (!debugEnabled) {
        return;
      }

      if (details) {
        console.debug('[realtime]', message, details);
        return;
      }

      console.debug('[realtime]', message);
    },
    [debugEnabled]
  );

  const getGardens = useGetGardens(forceFetchOptions);
  const getPlants = useGetPlants(forceFetchOptions);
  const getUser = useGetUser(forceFetchOptions);
  const getPlantData = useGetPlantData(forceFetchOptions);
  const getContainers = useGetContainers(forceFetchOptions);
  const getPlantInstances = useGetPlantInstances(forceFetchOptions);
  const getTasks = useGetTasks(forceFetchOptions);

  const refreshUserScope = useCallback(async () => {
    debug('refreshUserScope:start');

    const results = await Promise.allSettled([getGardens(), getPlants(), getUser(), getPlantData()]);

    debug('refreshUserScope:complete', {
      results: results.map((result) => result.status)
    });
  }, [debug, getGardens, getPlantData, getPlants, getUser]);

  const refreshGardenScope = useCallback(
    async (gardenId = selectedGarden?._id) => {
      if (!gardenId) {
        debug('refreshGardenScope:skipped', { reason: 'missing gardenId' });
        return;
      }

      debug('refreshGardenScope:start', {
        requestedGardenId: gardenId,
        selectedGardenId: selectedGarden?._id
      });

      const results = await Promise.allSettled([getContainers(), getPlantInstances(), getTasks()]);

      debug('refreshGardenScope:complete', {
        requestedGardenId: gardenId,
        selectedGardenId: selectedGarden?._id,
        results: results.map((result) => result.status)
      });
    },
    [debug, getContainers, getPlantInstances, getTasks, selectedGarden?._id]
  );

  useEffect(() => {
    refreshUserScopeRef.current = refreshUserScope;
  }, [refreshUserScope]);

  useEffect(() => {
    refreshGardenScopeRef.current = refreshGardenScope;
  }, [refreshGardenScope]);

  useEffect(() => {
    const handleOnline = () => {
      dispatch(setBrowserOnline(true));
    };

    const handleOffline = () => {
      dispatch(setBrowserOnline(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    selectedGardenIdRef.current = selectedGarden?._id;
    debug('selectedGardenRef:update', {
      selectedGardenId: selectedGarden?._id
    });
  }, [debug, selectedGarden?._id]);

  useEffect(() => {
    if (!user?.accessToken) {
      debug('socket:reset', { reason: 'missing access token' });
      socketRef.current?.disconnect();
      socketRef.current = null;
      dispatch(resetRealtimeState());
      return;
    }

    let isCurrentConnection = true;

    dispatch(setRealtimeBootstrapState({ complete: false, inProgress: true }));
    dispatch(setRealtimeConnected(false));
    dispatch(setRealtimeLastError(undefined));
    debug('socket:connect:start', {
      hasAccessToken: Boolean(user.accessToken),
      selectedGardenId: selectedGardenIdRef.current
    });

    const socket = io(getRealtimeServerUrl(), {
      autoConnect: false,
      auth: {
        token: user.accessToken
      },
      path: REALTIME_PATH,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      transports: ['websocket']
    });

    const completeBootstrap = () => {
      if (!isCurrentConnection) {
        return;
      }

      dispatch(setRealtimeBootstrapState({ complete: true, inProgress: false }));
    };

    const handleConnect = async () => {
      if (!isCurrentConnection) {
        return;
      }

      debug('socket:connect:success', {
        selectedGardenId: selectedGardenIdRef.current
      });
      dispatch(setRealtimeConnected(true));
      dispatch(setRealtimeLastError(undefined));

      try {
        await refreshUserScopeRef.current();

        if (selectedGardenIdRef.current) {
          debug('socket:gardenSubscribe:onConnect', {
            selectedGardenId: selectedGardenIdRef.current
          });
          socket.emit(REALTIME_EVENTS.gardenSubscribe, {
            gardenId: selectedGardenIdRef.current
          });
          await refreshGardenScopeRef.current(selectedGardenIdRef.current);
        }
      } finally {
        completeBootstrap();
      }
    };

    const handleConnectError = (error: Error) => {
      if (!isCurrentConnection) {
        return;
      }

      debug('socket:connect:error', {
        message: error.message
      });
      dispatch(setRealtimeConnected(false));
      dispatch(setRealtimeLastError(error.message));
      completeBootstrap();
    };

    const handleDisconnect = () => {
      if (!isCurrentConnection) {
        return;
      }

      debug('socket:disconnect');
      dispatch(setRealtimeConnected(false));
    };

    const handleUserSync = (message: RealtimeSyncEnvelope) => {
      if (Array.isArray(message.data?.gardens)) {
        dispatch(updateGardens(message.data.gardens));
      }

      if (Array.isArray(message.data?.plants)) {
        dispatch(updatePlants(message.data.plants));
      }

      if (message.data?.userDetails) {
        dispatch(updateUserDetails(message.data.userDetails));
      }

      if (message.data?.plantData) {
        dispatch(updatePlantData(message.data.plantData));
      }

      if (message.data?.picture) {
        dispatch(updatePicture(message.data.picture));
      }

      if (message.data?.deletedPictureId) {
        dispatch(clearPicture());
      }
    };

    const handleGardenSync = (message: RealtimeSyncEnvelope) => {
      if (Array.isArray(message.data?.containers)) {
        dispatch(updateContainers(message.data.containers));
      }

      if (Array.isArray(message.data?.plantInstances)) {
        dispatch(updatePlantInstances(message.data.plantInstances));
      }

      if (Array.isArray(message.data?.tasks)) {
        dispatch(updateTasks(message.data.tasks));
      }
    };

    socket.on('connect', () => {
      void handleConnect();
    });
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on(REALTIME_EVENTS.userSync, handleUserSync);
    socket.on(REALTIME_EVENTS.gardenSync, handleGardenSync);

    socketRef.current = socket;
    socket.connect();

    return () => {
      isCurrentConnection = false;
      debug('socket:cleanup');
      socket.off('connect');
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off(REALTIME_EVENTS.userSync, handleUserSync);
      socket.off(REALTIME_EVENTS.gardenSync, handleGardenSync);
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [debug, dispatch, user?.accessToken]);

  useEffect(() => {
    const socket = socketRef.current;
    const selectedGardenId = selectedGarden?._id;

    if (!socket?.connected) {
      debug('gardenSubscription:skipped', {
        reason: 'socket not connected',
        selectedGardenId
      });
      return;
    }

    if (!selectedGardenId) {
      debug('gardenSubscription:unsubscribe');
      socket.emit(REALTIME_EVENTS.gardenUnsubscribe);
      return;
    }

    debug('gardenSubscription:subscribe', {
      selectedGardenId
    });
    socket.emit(REALTIME_EVENTS.gardenSubscribe, {
      gardenId: selectedGardenId
    });
    void refreshGardenScopeRef.current(selectedGardenId);
  }, [debug, selectedGarden?._id]);
};

export const RealtimeController = () => {
  useRealtimeSync();
  return null;
};
