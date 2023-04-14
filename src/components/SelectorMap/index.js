import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { getGeoJSON } from '../../utils/API';

import IndicatorDropdown from '../IndicatorDropdown';
import './style.css';

// import {handleGeoJSON } from './utils';

const SelectorMap = ({ project, config, setter }) => {
  const [geoJSON, setGeoJSON] = useState();
  const [selection, setSelection] = useState();
  const [options, setOptions] = useState(config.indicators);
  const fillColor = config.color || '#fff3e2';

  const handleSetSelection = (key, option) => {
    setSelection(option);
  };
  
  // console.log(project, config);

  useEffect( () => {
    if (config.geoType && project) {
      getGeoJSON(project, config.geoType).then(({data}) =>{
        console.log(data);
        if (data[0]) {
          setGeoJSON(data[0]);
        }
      });
    }
    if (options && options[0]) {
      setSelection(options[0]);
    }


  }, []);

  useEffect(() => {
    if (!config.indicators && geoJSON) {
      const optionsFromGeoJSON = config.totalOption
        ? [config.totalOption]
        : [];
      
      geoJSON.features.forEach(({properties}) => 
        optionsFromGeoJSON.push(
          {
            label: properties[config.selectorField].toUpperCase(),
            key: properties[config.selectorField],
            dataPath: `${config.selectionDataPath ? `${config.selectionDataPath}.` : ''}${properties[config.selectorField]}`
          }
        ));
      setOptions(optionsFromGeoJSON);
      if (options && options[0]) {
        setSelection(options[0]);
      }
    }
  }, [geoJSON]);

  useEffect(() => {
    if (selection) {
      setter(config.setterKey.geoSelection, selection.dataPath);
    }
  }, [selection]);

  return geoJSON ? 
    (
      <div className='selector-map-wrapper'>
        <p>{config.label}</p>
        {selection && options ? (
          <IndicatorDropdown
            selectedOption={selection}
            setter={handleSetSelection}
            options={options}
          />
        ) : null}
        {selection ? (
          <div className='selector-map'>
            <MapContainer
              // key={`${selection.key}-selector-map`}
              center={config.center}
              zoom={config.zoom}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/">Esri: World Light Gray Base Map</a>'
                url='https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
              />
              <GeoJSON
                // key={`data-layer-${selection.key}`}
                data={geoJSON}
                style={feature => {
                  const selected = feature.properties[config.selectorField] === selection.key;
                  return {
                    fillColor: fillColor,
                    color: config.strokeColor || 'black',
                    weight: selected ? 2 : 1,
                    opacity: selected ? 1 : 0.5,
                    fillOpacity:  selected ? 1 :0.5
                  };
                }}
              />
            </MapContainer>
          </div>
        ) : (
          <div className='indicator-map-wrapper'>Loading...</div>
        )}
      </div>
    ) : (
      <div className='indicator-map-wrapper'>Loading...</div>
    );
};

SelectorMap.propTypes = {
  project: PropTypes.string,
  config: PropTypes.object,
  geoQuery: PropTypes.object,
  setter: PropTypes.func
};

export default SelectorMap;
