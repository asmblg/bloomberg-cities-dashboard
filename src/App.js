import './App.css';
import React, { useState, useEffect } from 'react';
import { getConfig } from './App.utils';
import Layout from './components/Layout';

const App = () => {
  const [config, setConfig] = useState(null);
  // const [cityData, setCityData] = useState();
  // const [tractGeoJSON, setTractGeoJSON] = useState();

  //Get Project
  const project = document.location.pathname.replace('/', '').toLowerCase();

  //Get Config
  useEffect(() => {
    // will use abort controller/controller signal when using cloud DB && Axios
    if (project) {
      let controller = true;

      getConfig(project).then(res => {
        if (res && controller) {
          setConfig(res);
        }
      });
      // Cleanup
      return () => {
        // will use abort controller when using DB && Axios
        controller = false;
      };
    }
    // getCityData(project).then(({ data }) => setCityData(data[0]));
  }, [project]);

  // useEffect(() => {
  //   if (config) {
  //     getGeoJSON(config.map).then(({ data }) => setTractGeoJSON(data));
  //   }
  // }, [config]);

  // console.log(tractGeoJSON);

  //Get City Data
  return (
    <div className='App'>
      {project && config ? (
        <Layout
          config={config}
          // cityData={cityData}
          // tractGeoJSON={tractGeoJSON}
        />
      ) : !project ? (
        '404'
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default App;
