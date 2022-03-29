import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Home } from './Home';
import { Login } from './Login';

export const Main = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (Meteor.userId() === null) {
      navigate({ pathname: 'login', search });
    } else if (pathname === '/login') {
      navigate('/');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
};
