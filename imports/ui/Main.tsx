import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { Meteor } from 'meteor/meteor';
import Login from './Login';
import Header from './Header';
import Actions from './Actions';
import Plants from './plants/Plants';
import PlantView from './plants/PlantView';
import Containers from './containers/Containers';
import ContainerView from './containers/ContainerView';

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
    <>
      <Header />
      <Actions />
      <Routes>
        <Route path="/" element={<Containers />} />
        <Route path="/container/:id" element={<ContainerView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/plant/:id" element={<PlantView />} />
      </Routes>
    </>
  );
};

export default Main;
