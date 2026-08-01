import React from 'react';
import { AppRouter } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
};

export default App;

