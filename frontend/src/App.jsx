import React from 'react';
import { BuilderProvider } from './context/BuilderContext';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <BuilderProvider>
      <MainLayout />
    </BuilderProvider>
  );
}

export default App;
