import './App.css';
import React, {useEffect, useState} from 'react';
import { getConfig, getCityData } from './App.utils';
import Layout from './components/Layout';

const App = () => {
  const [config, setConfig] = useState();
  const [cityData, setCityData] = useState();
  //Get Project
  const project = document.location.pathname.replace('/','').toLowerCase();
  
  //Get Config
  useEffect(() => {
    getConfig(project).then(({data}) => 
      setConfig(data[0]));
    getCityData(project)
      .then(({data}) => setCityData(data[0]))

  }, [project]);


  //Get City Data
  return (
    <div className="App">
      { config && cityData
          ? <Layout
              config={config}
              cityData={cityData}
           />
          : "Loading..."
      }
    </div>
  );
}

export default App;
