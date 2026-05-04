import { useEffect, useReducer } from 'react';
import LoginPage from './auth/LoginPage';
import { useCheckLogin } from './auth/useAuth';
import Loading from './components/Loading';
import GardensView from './gardens/GardensView';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectUser } from './store/slices/auth';
import { selectRealtimeBootstrapComplete } from './store/slices/global';
import { selectPlantInstancesByIds } from './store/slices/plant-instances';
import { buildTaskLookupByContainer, selectTasks } from './store/slices/tasks';
import { getStoredAccessToken, getStoredRefreshToken } from './utility/authStorage';

const Main = () => {
  const hasStoredSession = Boolean(getStoredAccessToken() || getStoredRefreshToken());
  const [loading, completeLoading] = useReducer(() => false, hasStoredSession);

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
    if (!hasStoredSession) {
      return;
    }

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
        completeLoading();
      }
    };

    checkAccessToken();

    return () => {
      alive = false;
    };
  }, [checkLogin, debugEnabled, hasStoredSession]);

  useEffect(() => {
    if (user) {
      completeLoading();
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
