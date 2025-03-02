import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import App from './App';

import './index.css';
// import './fonts/Roboto-Black.ttf';
// import './fonts/Roboto-BlackItalic.ttf';
// import './fonts/Roboto-Bold.ttf';
// import './fonts/Roboto-BoldItalic.ttf';
// import './fonts/Roboto-Italic.ttf';
// import './fonts/Roboto-Light.ttf';
// import './fonts/Roboto-LightItalic.ttf';
// import './fonts/Roboto-Medium.ttf';
// import './fonts/Roboto-MediumItalic.ttf';
// import './fonts/Roboto-Regular.ttf';
// import './fonts/Roboto-Thin.ttf';
// import './fonts/Roboto-ThinItalic.ttf';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
