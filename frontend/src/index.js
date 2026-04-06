import React from 'react';
import ReactDOM from 'react-dom/client';
import './pages/index.css';
import App from './App';
//“ReactDOM is used to render React components into the HTML page.”
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />// The App component is the main entry point of the React application. It will render the entire UI and handle routing, state management, and interactions with the backend API.
  </React.StrictMode>
);

// Optional: Service worker for PWA (if needed)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA