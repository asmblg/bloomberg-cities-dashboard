import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import MapEvents from './MapEvents';
import { getGeoJSON } from '../../utils/API';

import IndicatorDropdown from '../IndicatorDropdown';
import './style.css';

// import {handleGeoJSON } from './utils';

const SelectorMap = ({ project, config, setter }) => {
  const [geoJSON, setGeoJSON] = useState();
  const [selection, setSelection] = useState();
  const [options, setOptions] = useState();
  const [hoveredFeature, setHoveredFeature] = useState();  
  
  const fillColor = config.color || '#fff3e2';

  const handleSetSelection = (key, option) => {
    setSelection(option);
  };
  
  // console.log(project, config);

  useEffect( () => {
    if (config.geoType && project) {
      getGeoJSON(project, config.geoType).then(({data}) =>{
        // console.log(data);
        if (data[0]) {
          setGeoJSON(data[0]);
        }
      });
    }

    if ( config?.totalOption || config?.indicators) {
      setSelection(config?.totalOption || config?.indicators[0]);
    }

  }, []);

  useEffect(() => {
    if (!config?.indicators && geoJSON) {
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

      if (options?.[0]) {
        setSelection(options[0]);
      }
    }
  }, [geoJSON]);

  useEffect(() => {
    if (selection) {
      setter(config.setterKey.geoSelection, selection.dataPath);
    }
  }, [selection]);

  return (
    <div className='selector-map-wrapper' key='selector-map'>
      <p>{config?.label}</p>
      <IndicatorDropdown
        selectedOption={selection || config?.totalOption || config?.indicators[0]}
        setter={handleSetSelection}
        options={options}
      />
      <div className='selector-map'>
        <MapContainer
          key={'selector-map'}
          center={config.center}
          zoom={config.zoom}
          zoomControl={true}
          // zoomControl={false}
          // dragging={false}
          // doubleClickZoom={false}
          zoomSnap={.25}
          zoomDelta={.25}          
        >
          <MapEvents 
            setter={handleSetSelection}
            options={options}
            active={!hoveredFeature}
          />

          <TileLayer
            attribution='&copy; <a href="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/">Esri: World Light Gray Base Map</a>'
            url='https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          />
          {geoJSON ? 
            <GeoJSON
              key={`data-layer-${selection?.key}`}
              data={geoJSON || null}
              eventHandlers={{
                click: e => {
                  const value = e.propagatedFrom?.feature?.properties?.[config.selectorField];
                  const option = value ?
                    options.find(({key}) => key.toUpperCase() === value.toUpperCase())
                    : options[0];
                  // console.log(value);
                  handleSetSelection(null, option);
                },
                mouseover: e => {
                  const value = e.propagatedFrom?.feature?.properties?.[config.selectorField];
                  setHoveredFeature(value);
                },
                mouseout: () => setHoveredFeature()
              }}
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
            >
              <Tooltip>
                {hoveredFeature}
              </Tooltip>
            </GeoJSON>
            : null
          }
        </MapContainer>
      </div>
    </div>
  ); 
};

SelectorMap.propTypes = {
  project: PropTypes.string,
  config: PropTypes.object,
  geoQuery: PropTypes.object,
  setter: PropTypes.func
};

export default SelectorMap;

