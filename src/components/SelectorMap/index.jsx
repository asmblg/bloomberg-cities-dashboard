import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import MapEvents from './MapEvents';
import { getGeoJSON } from '../../utils/API';

import IndicatorDropdown from '../IndicatorDropdown';
import './style.css';

// import {handleGeoJSON } from './utils';

const SelectorMap = ({ project, config, setter, data, getter }) => {
  const [geoJSON, setGeoJSON] = useState();
  const [featureData, setFeatureData] = useState();
  const [bins, setBins] = useState();
  const [selection, setSelection] = useState();
  const [options, setOptions] = useState();
  const [hoveredFeature, setHoveredFeature] = useState();

  const fillColor = config.color || '#fff3e2';

  const handleSetSelection = (key, option) => {
    setSelection(option);
  };

  // console.log(project, config);

  useEffect(() => {
    if (config.geoType && project) {
      getGeoJSON(project, config.geoType).then(({ data }) => {
        // console.log(data);
        if (data[0]) {
          setGeoJSON(data[0]);
        }
      });
    }

    if (config?.totalOption || config?.indicators) {
      setSelection(config?.totalOption || config?.indicators?.[0]);
    }



    if (
      config?.indicator?.basePath ||
      getter?.[config?.getterKey?.selectedIndicator] ||
      getter?.[config?.getterKey?.selectorPath]
    ) {
      // Get data object containing geo keys and nested data values

      const dataObject = {};
      let aggregatorKey = null;

      const indicatorKey = getter?.[config?.getterKey?.selectedIndicator]?.value ||
        getter?.[config?.getterKey?.selectedIndicator] ||
        config?.indicator?.key;
      const indicatorKey2 = getter?.[config?.getterKey?.selectorPath]?.value ||
        getter?.[config?.getterKey?.selectorPath] ||
        config?.indicator?.key2;


      Object.entries(data?.[config.indicator.basePath] || {}).forEach(([key, value]) => {
        const obj = indicatorKey && indicatorKey2
          ? value?.[indicatorKey]?.[indicatorKey2]
          : indicatorKey
            ? value?.[indicatorKey]
            : indicatorKey2
              ? value?.[indicatorKey2]
              : value;
        dataObject[key] = { ...obj };
      });

      Object.values(dataObject).forEach((value, i) => {
        if (i === 0 && config?.indicator?.aggregator === 'current') {
          aggregatorKey = Object.keys(value).map(dateKey => {
            const year = dateKey.split('-')[0];
            const quarter = dateKey.split('-')[1]?.replace('Q', '');
            return {
              key: dateKey,
              value: Number(year) + Number(quarter)
            };
          })?.sort((a, b) =>
            b.value - a.value
          )?.[0]?.key;
        }
      })


      Object.entries(dataObject).forEach(([key, value]) => {
        dataObject[key] = value[aggregatorKey];
      }
      );

      // console.log({ aggregatorKey, dataObject });
      const valueArray = Object.entries(dataObject)
        .filter(([key, value]) => 
          config?.totalOption?.dataPath !== key && 
          value && !isNaN(parseInt(value))
        ).map(([key, value]) => value);
      const min = Math.min(...valueArray);
      const max = Math.max(...valueArray);
      const range = max - min;
      const colors = config?.colors || ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#636363', '#252525'];

      const pRange = Math.floor(range / colors.length || 5);
      const colorObject = {};

      // console.log({ min, max, range, pRange });

      Object.entries(dataObject).forEach(([key, value]) => {
        if (value && !isNaN(parseInt(value))) {
          const bin = Math.floor((value - min) / pRange);
          // console.log({ key, value, bin });
          const color = value === max ? colors[colors.length - 1] : colors[bin];
          colorObject[key] = color;
        } else {
          colorObject[key] = 'transparent';
        }
      });

      // console.log(dataObject);
      // console.log(colorObject);
      console.log({ dataObject });
      console.log({ basePath: config.indicator.basePath, indicatorKey, indicatorKey2 });
      console.log({ min, max, range, pRange });

      setBins(colorObject);;

      // setFeatureData(dataObject);
    }

  }, [
    data,
    getter?.[config?.getterKey?.selectedIndicator],
    getter?.[config?.getterKey?.selectorPath]

  ]);

  useEffect(() => {
    if (!config?.indicators && geoJSON) {
      const optionsFromGeoJSON = config.totalOption
        ? [config.totalOption]
        : [];

      geoJSON.features.forEach(({ properties }) =>
        optionsFromGeoJSON.push(
          {
            label: properties[config.selectorField].toUpperCase(),
            key: properties[config.selectorField],
            dataPath: `${config.selectionDataPath ? `${config.selectionDataPath}.` : ''}${config?.selectorValueFormat === 'toUpperCase' ? properties[config.selectorField].toUpperCase() : properties[config.selectorField]}`
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
      setter(config?.setterKey?.geoSelection, selection?.dataPath);
    }
  }, [selection]);

  return (
    <div className='selector-map-wrapper' key='selector-map'>
      {config?.label && <p>{config?.label}</p>}
      <IndicatorDropdown
        selectedOption={selection || config?.totalOption || config?.indicators?.[0]}
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
              key={`data-layer-${selection?.key}-${bins ? 'binned' : 'not-binned'}`}
              data={geoJSON || null}
              eventHandlers={{
                click: e => {
                  const value = e.propagatedFrom?.feature?.properties?.[config.selectorField];
                  const option = value ?
                    options.find(({ key }) => key.toUpperCase() === value.toUpperCase())
                    : options[0];
                  // console.log(value);
                  handleSetSelection(null, option);
                },
                mouseover: e => {
                  const value = e.propagatedFrom?.feature?.properties?.[config.selectorField];
                  // if (bins) {
                  //   setHoveredFeature(`${value}: ${featureData?.[config.selectorValueFormat === 'toUpperCase' ? value.toUpperCase() : value]}`);
                  // } else {
                  setHoveredFeature(value);
                  // }
                },
                mouseout: () => setHoveredFeature()
              }}
              style={feature => {
                const featureID = feature.properties[config.selectorField];
                const selected = featureID === selection?.key;
                const binnedColor = bins?.[config.selectorValueFormat === 'toUpperCase' ? featureID.toUpperCase() : featureID];
                return {
                  fillColor: binnedColor || fillColor,
                  color: config.strokeColor || 'black',
                  weight: selected ? 2 : 1,
                  opacity: selected ? 1 : 0.5,
                  fillOpacity: selected ? 1 : binnedColor ? 0.8 : 0.5
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

