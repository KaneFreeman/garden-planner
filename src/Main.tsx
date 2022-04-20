import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './Header';
import Plants from './plants/Plants';
import PlantView from './plants/PlantView';
import Containers from './containers/Containers';
import ContainerView from './containers/ContainerView';
import Tasks from './tasks/Tasks';
import ContainerSlotRoute from './containers/ContainerSlotRoute';
import ContainerSubSlotRoute from './containers/ContainerSubSlotRoute';
import TaskViewRoute from './tasks/TaskViewRoute';

const Main = () => {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect } = useAuth0();

  if (isLoading || error) {
    return (
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1">Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Button variant="outlined" size="large" onClick={loginWithRedirect}>
          Login in
        </Button>
      </Box>
    );
  }

  if (user?.email !== process.env.REACT_APP_MASTER_EMAIL) {
    return (
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1">Not authorized</Typography>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'center',
          height: 'calc(100vh - 56px)',
          top: '56px',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            justifyContent: 'center'
          }}
        >
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/containers" element={<Containers />} />
            <Route path="/container/:id" element={<ContainerView />} />
            <Route path="/container/:id/slot/:index" element={<ContainerSlotRoute />} />
            <Route path="/container/:id/slot/:index/sub-slot" element={<ContainerSubSlotRoute />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<PlantView />} />
            <Route path="/task/:id" element={<TaskViewRoute />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default Main;
