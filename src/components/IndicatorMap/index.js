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

      if (defaultSelection) {
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
      }
    }
  }, [getter?.[config?.getterKey?.selectedIndicator]]);

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
  }, [
    selectedIndicator, 
    mapGeoJSON, 
    colors,
    getter?.[config?.getterKey?.selectedIndicator]
  ]);

  // console.log(selectedIndicator);

  return bins && mapGeoJSON ? (
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
          key={`indicator-map-${selectedIndicator.key}`}
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
                const value = e.propagatedFrom?.feature?.properties?.[selectedIndicator?.key || defaultSelection.key];
                const indicator = selectedIndicator?.label || defaultSelection.label;
                const geo = e.propagatedFrom?.feature?.properties?.[config.nameProperty?.key ? config.nameProperty.key : 'Name'] || '';
                const units = selectedIndicator?.units || defaultSelection.units;
                setHoveredFeature({value, indicator, geo, units});
              }            
            }}
            key={`data-layer-${selectedIndicator?.key || defaultSelection.key }`}
            data={mapGeoJSON}
            filter={feature => {
              const value = feature?.properties?.[selectedIndicator?.key || defaultSelection.key];
              if (!isNaN(Number(value)) && Number(value) > 0) {
                return true;
              } else {
                return false;
              }
            }}
            style={feature => {
              const value = feature.properties[selectedIndicator?.key || defaultSelection.key];
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
                <p>{config?.nameProperty?.prefix || ''} {hoveredFeature?.geo}</p>
                <strong>{formatValue(hoveredFeature?.value, hoveredFeature?.units)}</strong>
              </div>
            </Tooltip>
          </GeoJSON>
          <Legend
            indicator={selectedIndicator || defaultSelection}
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
  geoJSON: PropTypes.object,
  project: PropTypes.string,
  getter: PropTypes.object
};

export default IndicatorMap;
