import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Optional: Import global styles if any
// import './index.css'; 

// Create root and render app
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("❌ Root element not found! Ensure 'index.html' has <div id='root'></div>");
}
