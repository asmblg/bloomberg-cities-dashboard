import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
// import CustomTooltip from '../CustomTooltip';
import IndicatorDropdown from '../IndicatorDropdown';
import Legend from './subComponents/Legend';

import { handleBinning, handleGeoJSON } from './utils';
import formatValue from '../../utils/formatValue';

import './style.css';

const IndicatorMap = ({ config, geoJSON }) => {
  const [bins, setBins] = useState(null);
  const [mapGeoJSON, setMapGeoJSON] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState();  

  // Default colors are a random palette not related to any city project
  const colors = config?.colors || ['#fff3e2', '#ffe5ca', '#fa9884', '#e74646'];
  const numOfBins = colors.length;
  const indicators = config?.indicators || null;

  const handleSetSelectedIndicator = (key, value) => {
    setSelectedIndicator(value);
  };

  useEffect(() => {
    if (geoJSON) {
      handleGeoJSON(geoJSON, indicators).then(updatedGeoJSON => {
        setMapGeoJSON(updatedGeoJSON);
        if (indicators?.[0]) {
          setSelectedIndicator(indicators[0]);
        }
      });

    }

  }, []);

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    if (colors && selectedIndicator && mapGeoJSON) {
      setBins(
        handleBinning({
          geoJSON: mapGeoJSON,
          colors,
          indicator: selectedIndicator?.key,
          numOfBins
        })
      );
    }
  }, [selectedIndicator, mapGeoJSON, colors]);



  return bins && mapGeoJSON ? (
    <div className='indicator-map-wrapper'>
      <p>Select socioeconomic variable to map:</p>
      
      <IndicatorDropdown
        selectedOption={selectedIndicator || indicators?.[0]}
        setter={handleSetSelectedIndicator}
        options={indicators || []}
      />
      {/* {selectedIndicator ? ( */}
      <div className='indicator-map'>
        <MapContainer
          key={'indicator-map'}
          center={config.center}
          zoom={config.zoom}
          zoomControl={true}
          zoomSnap={.25}
          zoomDelta={.25}
        >
          <TileLayer
            attribution='&copy; <a href="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/">Esri: World Light Gray Base Map</a>'
            url='https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          />

          <GeoJSON
            eventHandlers={{
              mouseover: e => {
                const value = e.propagatedFrom?.feature?.properties?.[selectedIndicator?.key || indicators?.[0].key];
                const indicator = selectedIndicator?.label || indicators?.[0].label;
                const geo = e.propagatedFrom?.feature?.properties?.['GEOID'];
                const units = selectedIndicator?.units || indicators?.[0].units;
                setHoveredFeature({value, indicator, geo, units});
              }            
            }}
            key={`data-layer-${selectedIndicator?.key || indicators?.[0].key }`}
            data={mapGeoJSON}
            filter={feature => {
              const value = feature?.properties?.[selectedIndicator?.key || indicators?.[0].key];
              if (!isNaN(parseInt(value)) && parseInt(value) >= 0) {
                return true;
              } else {
                return false;
              }
            }}
            style={feature => {
              const value = feature.properties[selectedIndicator?.key || indicators?.[0].key];
              const color = value
                ? bins
                  .filter(({ percentile }) => value <= percentile)
                  .map(({ color }) => color)[0]
                : 'transparent';
              return {
                fillColor: color,
                color: config.strokeColor || 'black',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.9
              };
            }}
          >
            <Tooltip>
              <div className='indicator-map-tooltip'>
                {/* <p>{hoveredFeature?.geo}</p> */}
                <p>{hoveredFeature?.indicator}</p>
                <strong>{formatValue(hoveredFeature?.value, hoveredFeature?.units)}</strong>
              </div>
            </Tooltip>
          </GeoJSON>
          <Legend
            indicator={selectedIndicator || indicators?.[0]}
            bins={bins}
            strokeColor={config.strokeColor || 'black'}
          />


        </MapContainer>
      </div>
    </div>
  ) : (
    <div className='indicator-map-wrapper'>Loading...</div>
  );
};

IndicatorMap.propTypes = {
  config: PropTypes.object,
  geoJSON: PropTypes.object
};

export default IndicatorMap;
