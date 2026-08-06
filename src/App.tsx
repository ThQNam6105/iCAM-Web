import React from 'react';
import { AppRouter } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/Toast/Toast';
import './App.css';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </LanguageProvider>
  );
};

export default App;

