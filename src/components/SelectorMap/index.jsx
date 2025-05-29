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
  // const [featureData, setFeatureData] = useState();
  const [bins, setBins] = useState();
  const [binCount, setBinCount] = useState(0);
  const [selection, setSelection] = useState();
  const [localSelection, setLocalSelection] = useState();
  const [options, setOptions] = useState();
  const [hoveredFeature, setHoveredFeature] = useState();
  // const [deactivateSetter, setDeactivateSetter] = useState(false);

  const fillColor = config.color || '#fff3e2';

  const handleSetSelection = (key, option) => {
    if (config?.getterKey?.activeFilter) {
      const activeFilter = getter?.[config?.getterKey?.activeFilter];
      const matchingOption = options?.filter(({ value, key }) => (
        key === activeFilter ||
        value === activeFilter ||
        key === activeFilter?.key ||
        value === activeFilter?.value
      ))?.[0];
      if (!matchingOption) {
        setLocalSelection(options?.[0]);
      } else {
        setLocalSelection(null);
      }
    }
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

    if (config?.totalOption || config?.indicators || config?.initialSelection) {
      setSelection(config?.totalOption || config?.indicators?.[0] || config?.initialSelection);
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
      // console.log({ dataObject });
      // console.log({ basePath: config.indicator.basePath, indicatorKey, indicatorKey2 });
      // console.log({ min, max, range, pRange });

      setBins(colorObject);
      setBinCount(binCount + 1);

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
    } else if (config?.indicators) {
      const optionsFromIndicators = config?.indicators?.map(({ label, key, dataPath, value }) => ({
        label,
        key,
        dataPath: dataPath || value
      }));
      setOptions(optionsFromIndicators);
    }
  }, [geoJSON]);

  useEffect(() => {
    if (selection) {
      
      setter(config?.setterKey?.geoSelection, selection?.dataPath);
    }
  }, [selection]);

  useEffect(() => {
    if (config?.getterKey?.activeFilter) {
      const activeFilter = getter?.[config?.getterKey?.activeFilter];
      const matchingOption = options?.filter(({ value, key }) => (
        key === activeFilter ||
        value === activeFilter ||
        key === activeFilter?.key ||
        value === activeFilter?.value
      ))?.[0];
      if (!matchingOption) {
        setLocalSelection(options?.[0]);
      } else {
        setLocalSelection(null);
      }
    }
  }, [getter?.[config?.getterKey?.activeFilter]]);

  return (
    <div className='selector-map-wrapper' key='selector-map'>
      {config?.label && <p>{config?.label}</p>}
      <IndicatorDropdown
        selectedOption={localSelection || selection || config?.totalOption || config?.indicators?.[0]}
        setter={handleSetSelection}
        options={options}
      />
      <div className='selector-map'>
        <MapContainer
          key={'selector-map'}
          center={config.center}
          zoom={config.zoom}
          zoomControl={true}
          attributionControl={false}
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
            // attribution='&copy; <a href="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/">Esri: World Light Gray Base Map</a>'
            url='https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          />
          {geoJSON ?
            <GeoJSON
              key={`data-layer-${binCount}-${localSelection?.key || selection?.key}-${bins ? 'binned' : 'not-binned'}`}
              data={geoJSON || null}
              filter={feature => {
                
                const featureID = feature.properties[config.selectorField];
                const bin = bins?.[config.selectorValueFormat === 'toUpperCase' ? featureID.toUpperCase() : featureID];
                // console.log
                const selected = localSelection 
                  ? featureID === localSelection?.key 
                  : featureID === selection?.key;
                
                return !selected && bin !== 'transparent';
                
              }}
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
                // const selected = featureID === selection?.key;
                const binnedColor = bins?.[config.selectorValueFormat === 'toUpperCase' ? featureID.toUpperCase() : featureID];
                return {
                  fillColor: binnedColor || fillColor,
                  color: binnedColor ? config.strokeColor || 'black' : 'transparent',
                  weight:  1,
                  opacity:  0.8,
                  fillOpacity: binnedColor ? 0.7 : 0.5,
                  zindex: 1
                };
              }}
            >
              <Tooltip>
                {hoveredFeature}
              </Tooltip>
            </GeoJSON>
            : null
          }
          {geoJSON ?
            <GeoJSON
              key={`selected-layer-${localSelection?.key || selection?.key}-${bins ? 'binned' : 'not-binned'}`}
              data={geoJSON || null}
              filter={feature => {
                const featureID = feature.properties[config.selectorField];
                const selected = localSelection 
                  ? featureID === localSelection?.key 
                  : featureID === selection?.key;
                return selected;
              }
              }
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
                const binnedColor = bins?.[config.selectorValueFormat === 'toUpperCase' ? featureID.toUpperCase() : featureID];
                return {
                  fillColor: binnedColor || fillColor,
                  color: 'black',
                  weight: 3,
                  opacity: 1,
                  fillOpacity: 1,
                  zindex: 1000 
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

