import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import numeral from 'numeral';
// import colormap from 'colormap';

import Legend from './subComponents/Legend';

import { handleBinning } from './utils';
import './style.css';
// import { geoJSON } from 'leaflet';

const DataMap = ({ mapConfig: { config }, tractGeoJSON, indicator }) => {
  const [bins, setBins] = useState();
  // const [range, setRange] = useState();
  // Default colors currently Tampa colors
  const colors = config.colors ? config.colors : ['#969696', '#72acd2', '#006aaf', '#002944'];
  const numOfBins = colors.length;
  // const numOfBins = config;
  // const type = manifest?.[indicator].type;

  // const formatString =
  //   type === 'percent' || type === 'time' ? '0.0' : type === 'money' ? '$0,0' : '0,0';

  useEffect(() => {
    if (colors) {
      setBins(
        handleBinning({
          geoJSON: tractGeoJSON,
          colors,
          indicator,
          numOfBins
        })
      );
      // const { colorObj, min, max } = handleColorData({
      //   data: data,
      //   colors: colors
      // });
      // setRange({ min: min, max: max });
      // console.log(data);
      // setColorData(colorObj);
    }
  }, [indicator]);

  return bins && tractGeoJSON ? (
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
          {tractGeoJSON && bins ? (
            <GeoJSON
              key={`data-layer-${indicator}`}
              data={tractGeoJSON}
              style={feature => {
                const value = feature.properties[indicator];
                // console.log(value);
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
          <Legend indicator={indicator} bins={bins} strokeColor={config.strokeColor || 'black'} />
        </MapContainer>
      ) : null}
    </div>
  ) : null;
};

DataMap.propTypes = {
  data: PropTypes.object,
  mapConfig: PropTypes.object,
  tractGeoJSON: PropTypes.object,
  indicator: PropTypes.string,
  manifest: PropTypes.object
};

export default DataMap;
