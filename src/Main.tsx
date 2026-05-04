import { useEffect, useState } from 'react';
import LoginPage from './auth/LoginPage';
import { useCheckLogin } from './auth/useAuth';
import Loading from './components/Loading';
import GardensView from './gardens/GardensView';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectUser } from './store/slices/auth';
import { selectRealtimeBootstrapComplete } from './store/slices/global';
import { selectPlantInstancesByIds } from './store/slices/plant-instances';
import { buildTaskLookupByContainer, selectTasks } from './store/slices/tasks';

const Main = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const plantInstancesByIds = useAppSelector(selectPlantInstancesByIds);
  const tasks = useAppSelector(selectTasks);
  const user = useAppSelector(selectUser);
  const realtimeBootstrapComplete = useAppSelector(selectRealtimeBootstrapComplete);
  const debugEnabled = import.meta.env.DEV;

  const checkLogin = useCheckLogin();

  useEffect(() => {
    if (!debugEnabled) {
      return;
    }

    console.debug('[main] state', {
      loading,
      hasUser: Boolean(user),
      realtimeBootstrapComplete
    });
  }, [debugEnabled, loading, realtimeBootstrapComplete, user]);

  useEffect(() => {
    setLoading(true);
    let alive = true;

    const checkAccessToken = async () => {
      if (debugEnabled) {
        console.debug('[main] checkLogin:start');
      }

      await checkLogin();

      if (debugEnabled) {
        console.debug('[main] checkLogin:complete');
      }

      if (alive) {
        setLoading(false);
      }
    };

    checkAccessToken();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugEnabled]);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    dispatch(buildTaskLookupByContainer({ tasks, plantInstancesByIds }));
  }, [dispatch, plantInstancesByIds, tasks]);

  if (loading || (user && !realtimeBootstrapComplete)) {
    return <Loading sx={{ m: 0, height: '100dvh' }} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <GardensView />;
};

export default Main;
