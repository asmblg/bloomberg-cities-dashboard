import './App.css';
import React from 'react';
// import { getConfig, getCityData, getGeoJSON } from './App.utils';
import Layout from './components/Layout';

const App = () => {
  // const [config, setConfig] = useState();
  // const [cityData, setCityData] = useState();
  // const [tractGeoJSON, setTractGeoJSON] = useState();

  //Get Project
  const project = document.location.pathname.replace('/', '').toLowerCase();

  // //Get Config
  // useEffect(() => {
  //   getConfig(project).then(({ data }) => setConfig(data[0]));
  //   getCityData(project).then(({ data }) => setCityData(data[0]));
  // }, [project]);

  // useEffect(() => {
  //   if (config) {
  //     getGeoJSON(config.map).then(({ data }) => setTractGeoJSON(data));
  //   }
  // }, [config]);

  // console.log(tractGeoJSON);

  //Get City Data
  return (
    <div className='App'>
      {/* {config && cityData ? ( */}
      <Layout
        project={project}
        // config={config}
        // cityData={cityData}
        // tractGeoJSON={tractGeoJSON}
      />
      {/* ) : (
        'Loading...'
      )} */}
    </div>
  );
};

export default App;
