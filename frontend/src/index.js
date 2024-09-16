import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './route/App';
import { UserProvider } from './context/UserContext';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
