import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Tooltip, Pane, Popup } from 'react-leaflet';
import L from 'leaflet';
import MapEvents from './MapEvents';
import { getGeoJSON } from '../../utils/API';
import formatValue from '../../utils/formatValue';
import InfoIcon from '../InfoIcon';
import Legend from '../IndicatorMap/subComponents/Legend';

import IndicatorDropdown from '../IndicatorDropdown';
import './style.css';

// import {handleGeoJSON } from './utils';

const SelectorMap = ({ project, config, setter, manifest, data, getter }) => {
  const [geoJSON, setGeoJSON] = useState();
  // const [featureData, setFeatureData] = useState();
  const [bins, setBins] = useState();
  const [legendBins, setLegendBins] = useState([]);
  const [binCount, setBinCount] = useState(0);
  const [selection, setSelection] = useState();
  const [localSelection, setLocalSelection] = useState();
  const [options, setOptions] = useState();
  const [hoveredFeature, setHoveredFeature] = useState();
  const [hoveredRefFeature, setHoveredRefFeature] = useState();
  const [hoveredRefLayerFeature, setHoveredRefLayerFeature] = useState();
  const [tooltipData, setTooltipData] = useState();
  const [refGeoJSON, setRefGeoJSON] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const refImageWidthCache = useRef({});
  // const [deactivateSetter, setDeactivateSetter] = useState(false);

  const fillColor = config.color || '#fff3e2';

  const cloneAggregateValue = value => {
    if (Array.isArray(value)) {
      return value.map(item => cloneAggregateValue(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => [entryKey, cloneAggregateValue(entryValue)])
      );
    }

    return value;
  };

  const mergeAggregatedValues = (baseValue, nextValue) => {
    if (baseValue == null) {
      return cloneAggregateValue(nextValue);
    }

    if (nextValue == null) {
      return cloneAggregateValue(baseValue);
    }

    if (
      !Array.isArray(baseValue)
      && !Array.isArray(nextValue)
      && typeof baseValue !== 'object'
      && typeof nextValue !== 'object'
    ) {
      const baseNumber = Number(baseValue);
      const nextNumber = Number(nextValue);

      if (Number.isFinite(baseNumber) && Number.isFinite(nextNumber)) {
        return baseNumber + nextNumber;
      }
    }

    if (
      baseValue
      && nextValue
      && typeof baseValue === 'object'
      && typeof nextValue === 'object'
      && !Array.isArray(baseValue)
      && !Array.isArray(nextValue)
    ) {
      const mergedValue = {};
      const mergedKeys = new Set([
        ...Object.keys(baseValue),
        ...Object.keys(nextValue)
      ]);

      mergedKeys.forEach(mergedKey => {
        mergedValue[mergedKey] = mergeAggregatedValues(baseValue[mergedKey], nextValue[mergedKey]);
      });

      return mergedValue;
    }

    return cloneAggregateValue(nextValue);
  };

  const sumFilterArrayValues = (nestedValue, filterArray) => {
    if (!filterArray?.length || !nestedValue || typeof nestedValue !== 'object' || Array.isArray(nestedValue)) {
      return nestedValue;
    }

    let hasMatch = false;

    const aggregatedValue = filterArray.reduce((accumulator, filterKey) => {
      const filterValue = nestedValue?.[filterKey] ?? nestedValue?.[`${Number(filterKey)}`];

      if (filterValue == null) {
        return accumulator;
      }

      hasMatch = true;
      return mergeAggregatedValues(accumulator, filterValue);
    }, null);

    return hasMatch ? aggregatedValue : null;
  };

  const preloadImages = urls => {
    if (!Array.isArray(urls) || typeof window === 'undefined') return;
    urls.forEach(url => {
      if (!url || typeof url !== 'string') return;
      const img = new window.Image();
      img.onload = () => {
        const constrainedWidth = Math.min(200, Math.max(100, Number(img.naturalWidth) || 100));
        refImageWidthCache.current[url] = constrainedWidth;
      };
      img.src = url;
    });
  };

  const centerRefPointTowardBottom = latlng => {
    if (!mapInstance || !latlng) return;
    const zoom = mapInstance.getZoom();
    const size = mapInstance.getSize();
    const point = mapInstance.project(latlng, zoom);
    const targetCenter = mapInstance.unproject(
      point.subtract([0, size.y * 0.28]),
      zoom
    );
    mapInstance.flyTo(targetCenter, zoom, { animate: true, duration: 0.35 });
  };

  const bindPolygonLabel = (feature, layer) => {
    if (!config?.showPolygonLabels) return;
    const geometryType = feature?.geometry?.type;
    if (!['Polygon', 'MultiPolygon'].includes(geometryType)) return;
    const labelKey = config?.polygonLabelKey || config?.selectorField || 'Name';
    const labelValue = feature?.properties?.[labelKey];
    if (!labelValue) return;

    layer.bindTooltip(`${labelValue}`, {
      permanent: true,
      direction: 'center',
      className: config?.polygonLabelClassName || 'map-polygon-label'
    });
  };

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

  const {
    manifestKey,
    dataInTooltip
  } = config;
  const labelManifest = {
    ...config?.labelManifest || {},
    ...manifest?.[manifestKey] || {}
  };

  const indicator = getter?.[config?.getterKey?.selectedIndicator]
  const selector = getter?.[config?.getterKey?.selectorPath]
  const selectorFilterArray = selector?.filterArray || selector?.indicator?.filterArray || null;

  const indicatorKey = indicator?.value ||
    indicator ||
    config?.indicator?.key;
  const indicatorKey2 = selector?.value ||
    selector ||
    config?.indicator?.key2;

  const activeIndicatorOption = (indicator && typeof indicator === 'object')
    ? indicator
    : config?.indicators?.find(option => (
      option?.key === indicator ||
      option?.value === indicator
    ));

  const activeIndicatorLabel = activeIndicatorOption?.label ||
    (typeof indicator === 'string' ? indicator.replaceAll('_', ' ') : null) ||
    config?.indicator?.label ||
    config?.indicator?.key ||
    '';

  const activeIndicatorUnits = activeIndicatorOption?.units ||
    selector?.units ||
    config?.indicator?.units;

  const normalizeLegendBoundary = value => {
    if (!Number.isFinite(value)) return value;

    if (Number.isInteger(value)) return value;

    if (Math.abs(value) >= 100) {
      return Math.round(value);
    }

    return Number(value.toFixed(2));
  };

  // console.log(project, config);

  useEffect(() => {
    if (config?.refLayers?.[0] && project) {
      Promise.all(config.refLayers.map(({ geoType }) => getGeoJSON(project, geoType)))
        .then(results => {
          const refLayersData = results.map(({ data }) => data?.[0]).filter(Boolean);
          setRefGeoJSON(refLayersData);

          const imageUrls = [];
          refLayersData.forEach((layer, i) => {
            const imageField = config?.refLayers?.[i]?.imageField || 'image';
            layer?.features?.forEach(feature => {
              const imageUrl = feature?.properties?.[imageField];
              if (imageUrl) imageUrls.push(imageUrl);
            });
          });
          preloadImages(imageUrls);
        });
    } else {
      setRefGeoJSON([]);
    }
  }, [config?.refLayers, project]);

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

      let dataObject = {};
      let aggregatorKey = null;


      if (selectorFilterArray?.length) {
        const baseData = config?.indicator?.basePath ? data?.[config?.indicator?.basePath] : data;
        const indicatorData = indicatorKey ? baseData?.[indicatorKey] : baseData;
        const aggregatedData = sumFilterArrayValues(indicatorData, selectorFilterArray);
        dataObject = aggregatedData && typeof aggregatedData === 'object' ? { ...aggregatedData } : {};
      } else {
        Object.entries(data?.[config?.indicator?.basePath] || {}).forEach(([key, value]) => {
          const obj = indicatorKey && indicatorKey2
            ? value?.[indicatorKey]?.[indicatorKey2]
            : indicatorKey
              ? value?.[indicatorKey]
              : indicatorKey2
                ? value?.[indicatorKey2]
                : value;
          dataObject[key] = { ...obj };
        });

        if (!data?.[config?.indicator?.basePath]) {
          const obj = indicatorKey && indicatorKey2
            ? data?.[indicatorKey]?.[indicatorKey2]
            : indicatorKey
              ? data?.[indicatorKey]
              : indicatorKey2
                ? data?.[indicatorKey2]
                : data;
          dataObject = { ...obj };
        }
      }

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
        // console.log({ key, value, aggregatorKey });
        dataObject[key] = value[aggregatorKey];
      }
      );



      // console.log({ aggregatorKey, dataObject });
      const valueArray = Object.entries(dataObject)
        .filter(([key]) => config?.totalOption?.dataPath !== key)
        .map(([, value]) => Number(value))
        .filter(value => Number.isFinite(value));
      const min = Math.min(...valueArray);
      const max = Math.max(...valueArray);
      const range = max - min;
      const colors = config?.colors || ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#636363', '#252525'];

      const pRange = range > 0 ? range / colors.length : 1;
      const colorObject = {};

      // console.log({ min, max, range, pRange });

      Object.entries(dataObject).forEach(([key, value]) => {
        const numericValue = Number(value);
        if (Number.isFinite(numericValue)) {
          const rawBin = Math.floor((numericValue - min) / pRange);
          const bin = Math.max(0, Math.min(colors.length - 1, rawBin));
          // console.log({ key, value, bin });
          const color = numericValue === max ? colors[colors.length - 1] : colors[bin];
          colorObject[key] = color;
        } else {
          colorObject[key] = 'transparent';
        }
      });

      const hasData = valueArray.length > 0 && Number.isFinite(min) && Number.isFinite(max);
      const nextLegendBins = hasData
        ? colors.map((color, index) => {
          const rangeStartRaw = min + (index * pRange);
          const rangeEndRaw = index === colors.length - 1
            ? max
            : Math.min(max, min + ((index + 1) * pRange));
          const rangeStart = normalizeLegendBoundary(rangeStartRaw);
          const rangeEnd = normalizeLegendBoundary(rangeEndRaw);

          return {
            color,
            percentile: index,
            label: Math.abs(rangeStart - rangeEnd) < Number.EPSILON
              ? `${rangeEnd}`
              : `${rangeStart} - ${rangeEnd}`
          };
        })
        : [];

      // console.log(dataObject);
      // console.log(colorObject);
      // console.log({ dataObject });
      // console.log({ basePath: config.indicator.basePath, indicatorKey, indicatorKey2 });
      // console.log({ min, max, range, pRange });

      setTooltipData({
        values: dataObject,
        units: activeIndicatorUnits
      });
      setBins(colorObject);
      setLegendBins(nextLegendBins);
      setBinCount(binCount + 1);

      // setFeatureData(dataObject);
    } else {
      setLegendBins([]);
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

      geoJSON.features.forEach(({ properties }) => {
        const label = properties[config.selectorField]
        optionsFromGeoJSON.push(
          {
            label: `${labelManifest?.[label] || label || ''}`.toUpperCase(),
            key: properties[config.selectorField],
            dataPath: `${config.selectionDataPath ? `${config.selectionDataPath}.` : ''}${config?.selectorValueFormat === 'toUpperCase' ? properties[config.selectorField].toUpperCase() : properties[config.selectorField]}`
          }
        )
      });

      setOptions(optionsFromGeoJSON);

      if (options?.[0]) {
        setSelection(options[0]);
      }
    } else if (config?.indicators) {
      const optionsFromIndicators = config?.indicators?.map(({ label, key, dataPath, value }) => ({
        label: `${labelManifest?.[label] || label || ''}`.toUpperCase(),
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

  // console.log({ tooltipData })

  return (
    <div className='selector-map-wrapper' key='selector-map'>
      {config?.label && <p>{config?.label}</p>}
      <div className='map-dropdown'>
        <IndicatorDropdown
          selectedOption={localSelection || selection || config?.totalOption || config?.indicators?.[0]}
          setter={handleSetSelection}
          options={options}
        />
        {/* <div> */}
          { config?.mapInfo && <InfoIcon config={config?.mapInfo} popup />}
        {/* </div> */}
      </div>

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
          whenReady={e => setMapInstance(e.target)}
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

          <Pane name='refTopPane' style={{ zIndex: 1000 }} />
          <Pane name='dataTooltipTopPane' style={{ zIndex: 1200 }} />
          <Pane name='refTooltipTopPane' style={{ zIndex: 1300 }} />

          {refGeoJSON.map((refLayerGeoJSON, i) => (
            <GeoJSON
              key={`selector-ref-layer-${i}`}
              pane='refTopPane'
              data={refLayerGeoJSON}
              pointToLayer={(feature, latlng) => {
                const pointStyle = {
                  pane: 'refTopPane',
                  radius: 6,
                  fillColor: '#0d3b66',
                  color: '#ffffff',
                  weight: 1.5,
                  opacity: 1,
                  fillOpacity: 1,
                  ...(config?.refLayers?.[i]?.pointStyle || {})
                };
                return L.circleMarker(latlng, pointStyle);
              }}
              eventHandlers={{
                click: e => {
                  const geometryType = e.propagatedFrom?.feature?.geometry?.type;
                  if (geometryType !== 'Point' && geometryType !== 'MultiPoint') return;
                  const labelField = config?.refLayers?.[i]?.labelField || 'name';
                  const imageField = config?.refLayers?.[i]?.imageField || 'image';
                  const value = e.propagatedFrom?.feature?.properties?.[labelField];
                  const imageUrl = e.propagatedFrom?.feature?.properties?.[imageField];
                  const latlng = e?.latlng || e?.sourceTarget?.getLatLng?.();
                  const popupWidth = imageUrl
                    ? refImageWidthCache.current[imageUrl] || 200
                    : 200;
                  setHoveredRefFeature({ value, imageUrl, layerIndex: i, latlng, popupWidth });
                  centerRefPointTowardBottom(latlng);
                },
                mouseover: e => {
                  const geometryType = e.propagatedFrom?.feature?.geometry?.type;
                  if (geometryType === 'Point' || geometryType === 'MultiPoint') return;
                  const labelField = config?.refLayers?.[i]?.labelField || 'name';
                  const value = e.propagatedFrom?.feature?.properties?.[labelField];
                  setHoveredRefLayerFeature({ value, layerIndex: i });
                },
                mouseout: e => {
                  const geometryType = e.propagatedFrom?.feature?.geometry?.type;
                  if (geometryType === 'Point' || geometryType === 'MultiPoint') return;
                  setHoveredRefLayerFeature(null);
                }
              }}
              style={feature => {
                if (feature?.geometry?.type === 'Point' || feature?.geometry?.type === 'MultiPoint') {
                  return {
                    radius: 6,
                    fillColor: '#0d3b66',
                    color: '#ffffff',
                    weight: 1.5,
                    opacity: 1,
                    fillOpacity: 1,
                    ...(config?.refLayers?.[i]?.pointStyle || {})
                  };
                }
                return {
                  fillColor: 'transparent',
                  color: 'white',
                  weight: 1,
                  fillOpacity: 0,
                  ...(config?.refLayers?.[i]?.style || {})
                };
              }}
            >
              {hoveredRefLayerFeature?.layerIndex === i && hoveredRefLayerFeature?.value && (
                <Tooltip pane='dataTooltipTopPane'>
                  <div>
                    <h3>{hoveredRefLayerFeature?.value}</h3>
                  </div>
                </Tooltip>
              )}
            </GeoJSON>
          ))}

          {hoveredRefFeature?.latlng && (hoveredRefFeature?.value || hoveredRefFeature?.imageUrl) && (
            <Popup
              pane='refTooltipTopPane'
              className='ref-point-popup'
              position={hoveredRefFeature.latlng}
              closeButton={false}
              autoPan={false}
              interactive={false}
            >
              <div
                className='indicator-map-ref-tooltip'
                style={{ width: `${hoveredRefFeature?.popupWidth || 200}px` }}
              >
                {hoveredRefFeature?.value && <h3>{hoveredRefFeature?.value}</h3>}
                {hoveredRefFeature?.imageUrl && (
                  <img
                    className='indicator-map-ref-tooltip-image'
                    src={hoveredRefFeature?.imageUrl}
                    alt={hoveredRefFeature?.value || 'Reference image'}
                  />
                )}
              </div>
            </Popup>
          )}
          {geoJSON ?
            <GeoJSON
              key={`data-layer-${binCount}-${localSelection?.key || selection?.key}-${bins ? 'binned' : 'not-binned'}`}
              data={geoJSON || null}
              onEachFeature={bindPolygonLabel}
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
                  color: binnedColor
                    ? config.strokeColor || 'black'
                    : 'black',
                  weight: 1,
                  opacity: config?.opacity ?? 0.8,
                  fillOpacity: binnedColor
                    ? (config?.fillOpacity ?? 0.8)
                    : (config?.emptyFillOpacity ?? 0.5),
                  zindex: 1
                };
              }}
            >
              {
                dataInTooltip && tooltipData
                  ? <Tooltip pane='dataTooltipTopPane'>
                    <div className='indicator-map-tooltip'>
                      <h4>{config.selectorValueFormat === 'toUpperCase'
                        ? `${labelManifest?.[hoveredFeature] || hoveredFeature}`.toUpperCase()
                        : `${labelManifest?.[hoveredFeature] || hoveredFeature}`}</h4>
                      {/* {JSON.stringify(hoveredFeature)} */}

                      <strong>{formatValue(tooltipData?.values?.[config.selectorValueFormat === 'toUpperCase'
                        ? `${hoveredFeature}`.toUpperCase()
                        : `${hoveredFeature}`], tooltipData?.units || '')}</strong>
                    </div>
                  </Tooltip>
                  : <Tooltip pane='dataTooltipTopPane'>
                    {`${labelManifest?.[hoveredFeature] || hoveredFeature}`}
                  </Tooltip>
              }
            </GeoJSON>
            : null
          }
          {geoJSON ?
            <GeoJSON
              key={`selected-layer-${localSelection?.key || selection?.key}-${bins ? 'binned' : 'not-binned'}`}
              data={geoJSON || null}
              onEachFeature={bindPolygonLabel}
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
                  opacity: config?.selectedOpacity ?? 1,
                  fillOpacity: config?.selectedFillOpacity ?? 1,
                  zindex: 1000
                };
              }}
            >
              {
                dataInTooltip && tooltipData
                  ? <Tooltip pane='dataTooltipTopPane'>
                    <div className='indicator-map-tooltip'>
                      <h4>{config.selectorValueFormat === 'toUpperCase'
                        ? `${labelManifest?.[hoveredFeature] || hoveredFeature}`.toUpperCase()
                        : `${labelManifest?.[hoveredFeature] || hoveredFeature}`}</h4>
                      {/* {JSON.stringify(hoveredFeature)} */}

                      <strong>{formatValue(tooltipData?.values?.[config.selectorValueFormat === 'toUpperCase'
                        ? `${hoveredFeature}`.toUpperCase()
                        : `${hoveredFeature}`], tooltipData?.units || '')}</strong>
                    </div>
                  </Tooltip>
                  : <Tooltip pane='dataTooltipTopPane'>
                    {`${labelManifest?.[hoveredFeature] || hoveredFeature}`}
                  </Tooltip>
              }
            </GeoJSON>
            : null
          }
        </MapContainer>

        {legendBins?.length > 0 && (
          <Legend
            className='selector-map-legend'
            bins={legendBins}
            strokeColor={config?.strokeColor || 'black'}
            indicator={{
              label: activeIndicatorLabel,
              units: activeIndicatorUnits
            }}
            title={activeIndicatorLabel}
          />
        )}
      </div>
      {/* <h5>{config?.indicator?.basePath || 'No Data Path Set'}.{indicatorKey}.{indicatorKey2}</h5> */}
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

