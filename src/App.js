import './App.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { handleConfig, handleRootVariables } from './App.utils';
import Layout from './components/Layout';
import { TailSpin } from 'react-loader-spinner';

const App = () => {
  const [config, setConfig] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const defaultCity = 'tampa'; // Will be used when no project name is present or spelling issues

  //Get Config
  useEffect(() => {
    // will use abort controller/controller signal when using cloud DB && Axios
    let controller = true;

    handleConfig(pathname, defaultCity).then(({ config: c, redirect }) => {
      if (c && controller) {
        handleRootVariables(c)
          .then(() => setConfig(c));
      }

      if (!c && controller && redirect === '404') {
        navigate('404');
      }
    });
    // Cleanup
    return () => {
      // will use abort controller when using DB && Axios
      controller = false;
    };
  }, []);

  return <div className='App'>{
    config ? 
      <Layout config={config} /> :
      <TailSpin 
        color={' #006aaf'}
        width={200}
        height={200}
        wrapperStyle={{
          // height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          paddingTop: 'calc(50vh - 250px)'
          // margin: 'auto',
        }}
      />
  }
  </div>;
};

export default App;
