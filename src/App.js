import './App.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { handleConfig, getManifest } from './App.utils';
import Layout from './components/Layout';

const App = () => {
  const [config, setConfig] = useState(null);
  const [dataManifest, setDataManifest] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const defaultCity = 'tampa'; // Will be used when no project name is present or spelling issues
  const defaultDashboardType = 'economic'; // Will be used when no dashboardType is present or spelling issues

  //Get Config
  useEffect(() => {
    // will use abort controller/controller signal when using cloud DB && Axios
    let controller = true;

    handleConfig(pathname, defaultCity, defaultDashboardType).then(({ config: c, redirect }) => {
      if (c && controller) {
        setConfig(c);

        if (redirect) {
          navigate(`${c.project.toLowerCase()}/${c.dashboardType}`);
        }
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

  useEffect(() => {
    if (config) {
      setDataManifest(getManifest(config.project, config.dashboardType));
    }
  }, [config]);

  return <div className='App'>{config && dataManifest ? <Layout config={config} dataManifest={dataManifest} /> : 'Loading...'}</div>;
};

export default App;
