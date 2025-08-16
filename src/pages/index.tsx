import React, { useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import CreativeStudio from '../components/CreativeStudio';

const Home = () => {
  return (
    <AuthProvider>
      <CreativeStudio />
    </AuthProvider>
  );
};

export default Home;