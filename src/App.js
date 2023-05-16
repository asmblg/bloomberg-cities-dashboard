import './App.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

import Layout from './components/Layout';

import { handleConfig, handleRootVariables } from './App.utils';

const App = () => {
  const [config, setConfig] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //Get Config
  useEffect(() => {
    // will use abort controller/controller signal when using cloud DB && Axios
    let controller = true;

    if (pathname !== '/') {
      handleConfig(pathname).then(({ config: c, redirect }) => {
        if (c && controller) {
          handleRootVariables(c).then(() => setConfig(c));
        }

        if (!c && controller && redirect === '404') {
          navigate('404');
        }
      });
    }
    // Cleanup
    return () => {
      // will use abort controller when using DB && Axios
      controller = false;
    };
  }, []);

  return (
    <div className='App'>
      {config || pathname === '/' ? (
        <Layout config={config} />
      ) : (
        <TailSpin
          color={'#006aaf'}
          width={200}
          height={200}
          wrapperStyle={{
            width: '100vw',
            justifyContent: 'center',
            paddingTop: 'calc(50vh - 250px)'
          }}
        />
      )}
    </div>
  );
};

export default App;
