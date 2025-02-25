import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
// import CustomTooltip from '../CustomTooltip';
import IndicatorDropdown from '../IndicatorDropdown';
import Legend from './subComponents/Legend';

import { handleBinning, handleGeoJSON, handleNoGeoJsonProp } from './utils';
// import { getGeoJSON } from '../../utils/API';
import formatValue from '../../utils/formatValue';

import './style.css';

const IndicatorMap = ({ config, geoJSON, project, getter }) => {
  const [bins, setBins] = useState(null);
  const [mapGeoJSON, setMapGeoJSON] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState();  

  // Default colors are a random palette not related to any city project
  const colors = config?.colors || ['#fff3e2', '#ffe5ca', '#fa9884', '#e74646'];
  const numOfBins = colors.length;
  const indicators = config?.indicators || null;
  const title = config?.title || 'Select socioeconomic variable to map:';
  const defaultSelection = getter?.[config?.getterKey?.selectedIndicator] || indicators?.[0]; 

  const handleSetSelectedIndicator = (key, value) => {
    setSelectedIndicator(value);
  };

  let varKey = selectedIndicator?.var 
  if ( typeof varKey !== 'string') {
    varKey = selectedIndicator?.key || defaultSelection?.key;
  }

  useEffect(() => {

    // Handles CP instance
    if (geoJSON) {
      handleGeoJSON(geoJSON, indicators, config?.filter).then(updatedGeoJSON => {
        setMapGeoJSON(updatedGeoJSON);
        if (defaultSelection) {
          // console.log(defaultSelection);
          setSelectedIndicator(defaultSelection);
        }
      });

    } else {

      // allows indicators present in config or an indicator obtained from a getter

      // if (defaultSelection) {
        handleNoGeoJsonProp(
          project, 
          config?.geoType, 
          indicators || [defaultSelection],
          config?.filter
        ).then(updatedGeoJSON => {
          if (updatedGeoJSON) {
            setMapGeoJSON(updatedGeoJSON);

            if (defaultSelection) {

              setSelectedIndicator(defaultSelection);
            }
          }
        });
      // }
    }
  }, [getter?.[config?.getterKey?.selectedIndicator]]);

  useEffect(() => {
    if (colors && selectedIndicator && mapGeoJSON) {
      console.log(mapGeoJSON)
      setBins(
        handleBinning({
          geoJSON: mapGeoJSON,
          colors,
          indicator: varKey,
          dataPath: selectedIndicator?.dataPath,
          aggregator: selectedIndicator?.aggregator,
          range: config?.range,
          numOfBins,
          manualBreaks: defaultSelection?.manualBreaks || selectedIndicator?.manualBreaks
        })
      );
      // console.log(bins);
    }
  }, [
    selectedIndicator, 
    mapGeoJSON, 
    colors,
    getter?.[config?.getterKey?.selectedIndicator]
  ]);

  // console.log(mapGeoJSON);
  
  return mapGeoJSON ? (
    <div className='indicator-map-wrapper'>
      {!config.externalDropdown && (
        <>
          <p>{title}</p>
          <IndicatorDropdown
            selectedOption={selectedIndicator || defaultSelection}
            setter={handleSetSelectedIndicator}
            options={indicators || []}
          />
        </>
      )}

      <div className='indicator-map'>
        <MapContainer
          key={`indicator-map-${varKey || 'no-data'}`}
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
                const value = e.propagatedFrom?.feature?.properties?.[varKey];
                const indicator = selectedIndicator?.label || defaultSelection?.label;
                const geo = e.propagatedFrom?.feature?.properties?.[config.nameProperty?.key ? config.nameProperty?.key : 'Name'] || '';
                const units = selectedIndicator?.units || defaultSelection?.units;
                setHoveredFeature({value, indicator, geo, units});
              }            
            }}
            key={`data-layer-${varKey || 'no-data' }`}
            data={mapGeoJSON}
            filter={feature => {
              const noIndicator = !selectedIndicator && !defaultSelection ;
              if (noIndicator) {
                return true;
              }
              let value = feature.properties[varKey];
              if (selectedIndicator?.aggregator === 'current') {
                const aggregatorKey = Object.keys(value).sort(dateKey => {
                  const year = dateKey.split('-')[0];
                  const quater = dateKey.split('-')[1]?.replace('Q', '');
                  return Number(year) + Number(quater);
                })?.[0]
                value = value[aggregatorKey];
              }
        
              if (selectedIndicator?.dataPath) {
                selectedIndicator?.dataPath.split('.').forEach(path => {
                  value = value?.[path] || null;
                });
              }
              if (!isNaN(Number(value)) && Number(value) > 0) {
                return true;
              } else {
                return false;
              }
            }}
            style={feature => {
              let value = feature.properties[varKey];
              if (selectedIndicator?.aggregator === 'current') {
                const aggregatorKey = Object.keys(value).sort(dateKey => {
                  const year = dateKey.split('-')[0];
                  const quater = dateKey.split('-')[1]?.replace('Q', '');
                  return Number(year) + Number(quater);
                })?.[0]
                value = value[aggregatorKey];
              }
        
              if (selectedIndicator?.dataPath) {
                selectedIndicator?.dataPath.split('.').forEach(path => {
                  value = value?.[path] || null;
                });
              }

              const color = bins?.filter(({ percentile }) => 
                  value <= percentile
                ).map(({ color }) => color)[0] || 'transparent';
              // console.log(color);
              return {
                fillColor: color,
                color: config?.strokeColor || color,
                weight: config?.weight || 1,
                // opacity: config?.opacity || 1,
                fillOpacity: config?.opacity || 1
              };
            }}
          >
          {config?.nameProperty?.prefix &&       
            (<Tooltip>
              <div className='indicator-map-tooltip'>
                <p>{config?.nameProperty?.prefix || ''} {hoveredFeature?.geo}</p>
                <strong>{formatValue(hoveredFeature?.value, hoveredFeature?.units)}</strong>
              </div>
            </Tooltip>)}
          </GeoJSON>
          {bins && !config.noLegend && (
            <Legend
              indicator={selectedIndicator || defaultSelection}
              bins={bins}
              strokeColor={config.strokeColor || 'black'}
            />
          )}

        </MapContainer>
      </div>
    </div>
  ) : (
    <div className='indicator-map-wrapper'>Loading...</div>
  );
};

IndicatorMap.propTypes = {
  config: PropTypes.object,
  geoJSON: PropTypes.object,
  project: PropTypes.string,
  getter: PropTypes.object
};

export default IndicatorMap;
