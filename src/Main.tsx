import { useEffect, useState } from 'react';
import LoginPage from './auth/LoginPage';
import { useCheckLogin } from './auth/useAuth';
import Loading from './components/Loading';
import GardensView from './gardens/GardensView';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectUser } from './store/slices/auth';
import { selectPlantInstancesByIds } from './store/slices/plant-instances';
import { buildTaskLookupByContainer, selectTasks } from './store/slices/tasks';
import { isNotNullish } from './utility/null.util';

const Main = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const plantInstancesByIds = useAppSelector(selectPlantInstancesByIds);
  const tasks = useAppSelector(selectTasks);
  const user = useAppSelector(selectUser);

  const checkLogin = useCheckLogin();

  useEffect(() => {
    setLoading(true);
    let alive = true;

    const checkAccessToken = async () => {
      const accessToken = localStorage.getItem('token');
      if (isNotNullish(accessToken)) {
        await checkLogin(accessToken);
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
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    dispatch(buildTaskLookupByContainer({ tasks, plantInstancesByIds }));
  }, [dispatch, plantInstancesByIds, tasks]);

  console.log('[MAIN] loading', loading, 'user', user);

  if (loading) {
    return <Loading sx={{ m: 0, height: '100dvh' }} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <GardensView />;
};

export default Main;
