import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Icon } from 'semantic-ui-react';
// import numeral from 'numeral';
// import colormap from 'colormap';

import Legend from './subComponents/Legend';

import { handleBinning } from './utils';
import getIndicatorConfigFromManifest from '../../utils/getIndicatorConfigFromManifest';
import './style.css';
// import { geoJSON } from 'leaflet';

const DataMap = ({ mapConfig: { config }, geoJSON, data, dataManifest }) => {
  const [bins, setBins] = useState();
  const [indicators, setIndicators] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Default colors currently Tampa colors
  const colors = config.colors ? config.colors : ['#969696', '#72acd2', '#006aaf', '#002944'];
  const numOfBins = colors.length;
  // const numOfBins = config;
  // const type = manifest?.[indicator].type;

  // const formatString =
  //   type === 'percent' || type === 'time' ? '0.0' : type === 'money' ? '$0,0' : '0,0';

  useEffect(() => {
    const configIndicators =
      config.indicators && config.indicators[0]
        ? config.indicators.map(str => getIndicatorConfigFromManifest(dataManifest, str))
        : null;

    if (configIndicators) {
      setIndicators(configIndicators);
      setSelectedIndicator(configIndicators[0]);
    }
  }, [geoJSON]);

  useEffect(() => {
    if (colors && selectedIndicator) {
      setBins(
        handleBinning({
          geoJSON,
          colors,
          indicator: selectedIndicator.dataKey,
          numOfBins
        })
      );
    }
  }, [selectedIndicator]);

  return bins ? (
    <div className='cp-map-wrapper'>
      {selectedIndicator && indicators ? (
        <>
          <div className='cp-map-dropdown'>
            <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
              <h3>{selectedIndicator.short_name}</h3>
            </div>
          </div>
          {dropdownOpen ? (
            <ul className='dropdown-indicators-container'>
              {indicators.map(indicator => (
                <li
                  key={indicator.dataKey}
                  className={
                    selectedIndicator.dataKey === indicator.dataKey
                      ? 'selected-indicator bold-font'
                      : 'unselected-indicator'
                  }
                  onClick={() => {
                    if (selectedIndicator.dataKey !== indicator.dataKey) {
                      setSelectedIndicator(indicator);
                    }
                    setDropdownOpen(false);
                  }}
                >
                  {indicator.short_name || '-'}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
      {selectedIndicator && geoJSON && data ? (
        <div className='data-map'>
          {bins ? (
            <MapContainer
              key={'data-map'}
              center={config.center}
              zoom={config.zoom}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {bins ? (
                <GeoJSON
                  key={`data-layer-${selectedIndicator.dataKey}`}
                  data={geoJSON}
                  style={feature => {
                    const value = feature.properties[selectedIndicator.dataKey];
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
                />
              ) : null}
              <Legend
                indicator={selectedIndicator.short_name}
                bins={bins}
                strokeColor={config.strokeColor || 'black'}
              />
            </MapContainer>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;
};

DataMap.propTypes = {
  data: PropTypes.object,
  mapConfig: PropTypes.object,
  geoJSON: PropTypes.object,
  // indicator: PropTypes.string,
  dataManifest: PropTypes.array
};

export default DataMap;
