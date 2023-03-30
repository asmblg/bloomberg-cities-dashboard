import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import numeral from 'numeral';
// import colormap from 'colormap';

import IndicatorDropdown from '../IndicatorDropdown';
// import IndicatorSelectDropdown from './subComponents/IndicatorSelectDropdown';
import Legend from './subComponents/Legend';

import { handleBinning } from './utils';
import './style.css';

const IndicatorMap = ({ config, geoJSON, data, dataManifest }) => {
  const [bins, setBins] = useState();
  const [indicators, setIndicators] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  // Default colors currently Tampa colors
  const colors = config.colors ? config.colors : ['#969696', '#72acd2', '#006aaf', '#002944'];
  const numOfBins = colors.length;

  useEffect(() => {
    const configIndicators =
      config.indicators && config.indicators[0]
        ? config.indicators.map(key => dataManifest.indicators[key])
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
          indicator: selectedIndicator.key,
          numOfBins
        })
      );
    }
  }, [selectedIndicator]);

  return bins ? (
    <div className='indicator-map-wrapper'>
      {selectedIndicator && indicators ? (
        <IndicatorDropdown
          selectedOption={selectedIndicator}
          setter={setSelectedIndicator}
          options={indicators}
        />
      ) : null}
      {selectedIndicator && geoJSON && data ? (
        <div className='indicator-map'>
          {bins ? (
            <MapContainer
              key={'indicator-map'}
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
                  key={`data-layer-${selectedIndicator.key}`}
                  data={geoJSON}
                  style={feature => {
                    const value = feature.properties[selectedIndicator.key];
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

IndicatorMap.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  geoJSON: PropTypes.object,
  dataManifest: PropTypes.object
};

export default IndicatorMap;
