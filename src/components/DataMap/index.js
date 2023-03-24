import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import numeral from 'numeral';
import colormap from 'colormap';
import './style.css';

import { handleBinning } from './utils';
// import { geoJSON } from 'leaflet';

const DataMap = ({ mapConfig, tractGeoJSON, indicator, manifest }) => {
  const [bins, setBins] = useState();
  // const [range, setRange] = useState();
  const numOfBins = 10;
  const colors = colormap({
    colormap: 'bathymetry',
    nshades: numOfBins,
    format: 'hex',
    alpha: 1
  });

  // const type = manifest?.[indicator].type;

  // const formatString =
  //   type === 'percent' || type === 'time' ? '0.0' : type === 'money' ? '$0,0' : '0,0';

  useEffect(() => {
    if (colors) {

      setBins(handleBinning({
        geoJSON: tractGeoJSON,
        colors,
        indicator,
        numOfBins
      }));
      // const { colorObj, min, max } = handleColorData({
      //   data: data,
      //   colors: colors
      // });
      // setRange({ min: min, max: max });
      // console.log(data);
      // setColorData(colorObj);
    }
  }, [indicator]);

  console.log(bins && tractGeoJSON ? 'yes' : 'no');

  console.log(mapConfig);
  return bins && tractGeoJSON ? (
    <div className='data-map'>
      {bins ? (
        <MapContainer key={'data-map'} center={mapConfig.config.center} zoom={mapConfig.config.zoom} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {tractGeoJSON && bins ? (
            <GeoJSON
              key={`data-layer-${indicator}`}
              data={tractGeoJSON}
              style={feature => {
                // console.log(feature);
                const value = feature.properties[indicator];

                const color = value 
                  ? bins
                    .filter(({percentile}) => value <= percentile )
                    .map((({color}) => color))[0]
                  : 'transparent';
                return {
                  fillColor: color,
                  color: 'black',
                  weight: 1,
                  opacity: 0.8,
                  fillOpacity: 0.9
                };
              }}
            />
          ) : null}
        </MapContainer>
      ) : null}
      {/* <div className='color-ramp'>
        <div className='color-ramp-label'>
          {range
            ? `${numeral(range.min).format(formatString)}${type === 'percent' ? '%' : ''}`
            : 'min'}
        </div>
        {colors.map((color, i) => (
          <div key={`color-bin-${i}`} className='color-bin' style={{ backgroundColor: color }} />
        ))}
        <div className='color-ramp-label'>
          {range
            ? `${numeral(range.max).format(formatString)}${type === 'percent' ? '%' : ''}`
            : 'max'}
        </div>
      </div> */}
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
