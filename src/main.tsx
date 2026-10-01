import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MotionConfig } from 'motion/react';
import './styles/index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: 'easeOut' }}>
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
