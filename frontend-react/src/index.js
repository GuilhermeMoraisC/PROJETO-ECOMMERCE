// // Arquivo: src/index.js (VERSÃO ATUALIZADA)
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { AuthProvider } from './context/AuthContext'; // <-- IMPORTE O PROVIDER

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* Envolva o <App /> com o AuthProvider */}
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// );

// reportWebVitals();

// Arquivo: src/index.js (VERSÃO ATUALIZADA)
import React from 'react';
import ReactDOM from 'react-dom/client';

// IMPORTE OS CSS DO SLIDER AQUI
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envolva o <App /> com o AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();