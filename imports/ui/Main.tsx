import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Meteor } from 'meteor/meteor';
import Login from './Login';
import Header from './Header';
import Plants from './plants/Plants';
import PlantView from './plants/PlantView';
import Containers from './containers/Containers';
import ContainerView from './containers/ContainerView';
import ContainerSlotView from './containers/ContainerSlotView';
import Tasks from './tasks/Tasks';

const Main = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (Meteor.userId() === null) {
      navigate({ pathname: 'login', search });
    } else if (pathname === '/login') {
      navigate('/');
    }
  }, [navigate, pathname, search]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
          top: 64,
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
            <Route path="/container/:id/slot/:index" element={<ContainerSlotView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<PlantView />} />
          </Routes>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Main;
