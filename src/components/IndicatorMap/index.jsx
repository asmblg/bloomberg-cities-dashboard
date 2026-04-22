import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Tooltip, Pane, Popup } from 'react-leaflet';
import L from 'leaflet';
import InfoIcon from '../InfoIcon';
// import CustomTooltip from '../CustomTooltip';
// import { TailSpin } from 'react-loader-spinner';

import IndicatorDropdown from '../IndicatorDropdown';
import Legend from './subComponents/Legend';
import { getGeoJSON } from '../../utils/API';

import { handleBinning, handleGeoJSON, handleNoGeoJsonProp } from './utils';
// import { getGeoJSON } from '../../utils/API';
import formatValue from '../../utils/formatValue';

import './style.css';
import formatQuarterDate from '../../utils/formatQuarterDate';

const IndicatorMap = ({
  config,
  geoJSON,
  project,
  getter,
  data
  // lang 
}) => {

  const [bins, setBins] = useState(null);
  const [mapGeoJSON, setMapGeoJSON] = useState(null);
  const [refGeoJSON, setRefGeoJSON] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState();
  const [hoveredRefFeature, setHoveredRefFeature] = useState();
  const [hoveredRefLayerFeature, setHoveredRefLayerFeature] = useState();
  const [date, setDate] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const refImageWidthCache = useRef({});

  // Default colors are a random palette not related to any city project
  const colors = config?.colors || ['#fff3e2', '#ffe5ca', '#fa9884', '#e74646'];
  const numOfBins = colors.length;
  const title = config?.title || 'Select socioeconomic variable to map:';
  const indicators = config?.indicators || null;
  const selectedOption = getter?.[config?.getterKey?.selectedIndicator];
  const defaultSelection = selectedOption || indicators?.[0];

  const handleSetSelectedIndicator = (key, value) => {
    setSelectedIndicator(value);
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
    const labelKey = config?.polygonLabelKey || config?.nameProperty?.key || 'Name';
    const labelValue = feature?.properties?.[labelKey];
    if (!labelValue) return;

    layer.bindTooltip(`${labelValue}`, {
      permanent: true,
      direction: 'center',
      className: config?.polygonLabelClassName || 'map-polygon-label'
    });
  };

  let varKey = getter?.[config?.getterKey?.selectedIndicator]?.indicator?.var || getter?.[config?.getterKey?.selectedIndicator]?.var || getter?.[config?.getterKey?.selectedIndicator]?.indicator?.key || getter?.[config?.getterKey?.selectedIndicator]?.key || selectedIndicator?.var || defaultSelection?.key;
  if (typeof varKey !== 'string') {
    varKey = selectedIndicator?.key || defaultSelection?.key || config?.indicator?.key;
  }

  useEffect(() => {
    if (!config?.refLayers?.[0] || !project) {
      setRefGeoJSON([]);
      return;
    }

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
  }, [config?.refLayers, project]);

  useEffect(() => {

    const getterSelection = getter?.[config?.getterKey?.selectedIndicator];
    const getterIndicator = getterSelection?.indicator || getterSelection;
    const indicatorForMap = getterIndicator
      ? {
        ...getterIndicator,
        filterArray: getterSelection?.filterArray || getterIndicator?.filterArray
      }
      : getterIndicator;

    // console.log('Selected indicator from getter', getterIndicator, getter?.[config?.getterKey?.selectedIndicator]);
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
        indicators || [indicatorForMap || defaultSelection || config?.indicator],
        config?.filter,
        data,
        config?.joinKey,
        config?.joinValueFormat
      ).then(updatedGeoJSON => {
        // console.log('Updated GeoJSON', updatedGeoJSON);
        if (updatedGeoJSON) {
          setMapGeoJSON(updatedGeoJSON);

          if (defaultSelection) {

            setSelectedIndicator(defaultSelection);
          }
        } else {
          setMapGeoJSON(null);
        }
      });
      // }
    }
  }, [
    getter?.[config?.getterKey?.selectedIndicator],
    geoJSON
  ]);

  useEffect(() => {
    const getterSelection = getter?.[config?.getterKey?.selectedIndicator];
    const getterIndicator = getterSelection?.indicator || getterSelection;

    if (colors && (getterIndicator || selectedIndicator || config?.indicator) && mapGeoJSON) {
      // console.log(mapGeoJSON)
      const { arrayWithLabels, extractedDate } = handleBinning({
        geoJSON: mapGeoJSON,
        colors,
        indicator: getterIndicator?.var || varKey || config?.indicator?.var,
        dataPath: getterIndicator?.dataPath || selectedIndicator?.dataPath || config?.indicator?.dataPath,
        aggregator: getterIndicator?.aggregator || selectedIndicator?.aggregator || config?.indicator?.aggregator,
        range: config?.range,
        numOfBins,
        manualBreaks: config?.manualBreaks || defaultSelection?.manualBreaks || selectedIndicator?.manualBreaks
      })

      setBins(
        arrayWithLabels
      );

      setDate(extractedDate);
      // console.log(bins);
    }
  }, [
    selectedIndicator,
    mapGeoJSON,
    colors,
    getter?.[config?.getterKey?.selectedIndicator],
    defaultSelection,
    varKey,
    data
  ]);

  // console.log(mapGeoJSON);
  const sublabelArray = [
    selectedIndicator?.label,
    config.indicator?.geo
  ].filter(item => item).join(', ');

  return (//mapGeoJSON ? (
    <div className='indicator-map-wrapper'>
      {!config.externalDropdown && (
        <div className='map-dropdown'>
          {!config?.noTitle
            ? <p>{title} {date}</p>
            : config?.indicator?.label
              ? <div>
                <h4>{config.indicator.label?.toUpperCase()}</h4>
                <h5 className='simple-card-sub-header'>
                  {sublabelArray?.toUpperCase() || ''}{date ? `, ${formatQuarterDate(date, 'QX YYYY', config?.lang)}` : null}
                </h5>
              </div>
              : null
          }
          {!config?.indicator?.label &&
            <IndicatorDropdown
              selectedOption={selectedIndicator || defaultSelection}
              setter={handleSetSelectedIndicator}
              options={indicators || []}
              disableSort={config?.disableSort || false}
            />
          }
          {config?.mapInfo && <InfoIcon config={config?.mapInfo} popup />}
        </div>
      )}
      {
        // mapGeoJSON 
        // ? 
        <div className='indicator-map'>
          <MapContainer
            key={`indicator-map-${varKey ? 'data' : 'no-data'}-${getter?.[config?.getterKey?.selectedIndicator]?.indicator?.dataPath?.replace(/\./g, '-') || ''}`}
            center={config.center}
            zoom={config.zoom}
            zoomControl={true}
            zoomSnap={.2}
            zoomDelta={.2}
            attributionControl={false}
            whenReady={e => setMapInstance(e.target)}
          >
            <TileLayer
              // attribution='&copy; <a href="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/">Esri: World Light Gray Base Map</a>'
              url='https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            />

            <Pane name='refTopPane' style={{ zIndex: 1000 }} />
            <Pane name='dataTooltipTopPane' style={{ zIndex: 1200 }} />
            <Pane name='refTooltipTopPane' style={{ zIndex: 1300 }} />


            {refGeoJSON.map((refGeoJSON, i) => (

              <GeoJSON
                key={`ref-layer-${i}`}
                pane={'refTopPane'}
                // Always on top of the data layer
                data={refGeoJSON}
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
                    ...config?.refLayers?.[i]?.style || {}
                  };
                }}
              // style={config?.refStyles?.[i]}
              >
                {hoveredRefLayerFeature?.layerIndex === i && hoveredRefLayerFeature?.value &&
                  (<Tooltip pane='dataTooltipTopPane'>
                    <div>
                      <h3>{hoveredRefLayerFeature?.value}</h3>
                    </div>
                  </Tooltip>)}
              </GeoJSON>
            ))
            }

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


            {
              mapGeoJSON
                ? <GeoJSON
                  pane='overlayPane'
                  eventHandlers={{
                    mouseover: e => {
                      const value = e.propagatedFrom?.feature?.properties?.[varKey];
                      const indicator = selectedIndicator?.label || defaultSelection?.label || config?.indicator;
                      const geo = e.propagatedFrom?.feature?.properties?.[config.nameProperty?.key ? config.nameProperty?.key : 'Name'] || '';
                      const units = selectedIndicator?.units || defaultSelection?.units;
                      setHoveredFeature({ value, indicator, geo, units });
                    },
                    mouseout: e => {
                      setHoveredFeature(null);
                    }
                  }}
                  key={`data-layer-${varKey}${'no-data'}${date ? `-${date}` : ''}-${bins?.map(bin => bin.percentile).join('-')}`}
                  data={mapGeoJSON}
                  filter={feature => {
                    const noIndicator = !selectedIndicator && !defaultSelection;
                    if (noIndicator) {
                      return true;
                    }
                    let value = feature.properties[varKey];
                    if ((selectedIndicator?.aggregator || config?.indicator?.aggregator) === 'current' && date) {
                      // const aggregatorKey = Object.keys(value).sort(dateKey => {
                      //   const year = dateKey.split('-')[0];
                      //   const quater = dateKey.split('-')[1]?.replace('Q', '');
                      //   return Number(year) + Number(quater);
                      // })?.[0]
                      value = value[date];
                    }
                  

                    if (selectedIndicator?.dataPath && typeof value === 'object') {
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
                    if (selectedIndicator?.aggregator === 'current' || config?.indicator?.aggregator === 'current' && date) {
                      // const aggregatorKey = Object.keys(value).sort(dateKey => {
                      //   const year = dateKey.split('-')[0];
                      //   const quater = dateKey.split('-')[1]?.replace('Q', '');
                      //   return Number(year) + Number(quater);
                      // })?.[0]
                      // console.log('AGGREGATOR KEY', date);
                      value = value[date];
                    }

                    if (selectedIndicator?.dataPath && typeof value === 'object') {
                      selectedIndicator?.dataPath.split('.').forEach(path => {
                        value = value?.[path] || null;
                      });
                    }

                    // console.log('Feature value', value);

                    const color = bins?.filter(({ percentile }) =>
                      value <= percentile
                    ).map(({ color }) => color)[0] || 'transparent';
                    // console.log(color);
                    return {
                      fillColor: color,
                      color: config?.strokeColor || color,
                      weight: config?.weight || 1,
                      // opacity: config?.opacity || 1,
                      fillOpacity: config?.fillOpacity ?? config?.opacity ?? 1
                    };
                  }}
                  onEachFeature={bindPolygonLabel}
                >
                  {!config?.refGeoJSON && hoveredFeature?.value &&
                    (<Tooltip pane='dataTooltipTopPane'>
                      <div className='indicator-map-tooltip'>
                        <h4>{config?.nameProperty?.prefix || ''} {hoveredFeature?.geo}</h4>
                        {/* {JSON.stringify(hoveredFeature)} */}
                        <strong>{formatValue(hoveredFeature?.value?.[date] || hoveredFeature?.value, hoveredFeature?.units)}</strong>
                      </div>
                    </Tooltip>)}
                </GeoJSON>
                : null
            }

            {bins && !config.noLegend && (
              <Legend
                indicator={selectedIndicator || defaultSelection || config?.indicator}
                bins={bins}
                strokeColor={config.strokeColor || 'black'}
                title={config?.legend?.showIndicatorLabel
                  ? (selectedIndicator?.label || defaultSelection?.label || config?.indicator?.label || config?.legend?.title)
                  : config?.legend?.title}
              />
            )}

          </MapContainer>


        </div>

        // : null
        // <TailSpin
        //   color={'#006aaf'}
        //   width={200}
        //   height={200}
        // />    // <div className='indicator-map-wrapper'>Loading...</div>
      }
      {/* {
            config?.horizontalLegend && bins && date && (
              <div                 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto',
                  padding: '.5em',
                  flexDirection: 'row',
                  // gap: '.1rem',
                  backgroundColor: 'white',
                  // position: 'relative',
                  // top: '-60px',
                  height: '30px',
                  textAlign: 'center',
                  // width: 'fit-content',
                  zIndex: 10001,
                }}>
                {formatQuarterDate(date, 'QX YYYY', lang)}
              </div>
            )
          } */}
      {
        config.horizontalLegend && bins && (
          <div
            className='horizontal-legend'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginTop: '1rem',
              // marginBottom: '1rem',
              padding: '.5em .5em 0 .5em',
              flexDirection: 'row',
              gap: '.1rem',
              backgroundColor: 'white',
              // position: 'relative',
              // top: '-90px',
              height: '40px',
              zIndex: 10000,
            }}>
            <h5
              className='horizontal-legend-labels'
              style={{
                padding: '0 .5rem',
                maxWidth: '100px',
                textAlign: 'center',

              }}
            >
              {config?.horizontalLegend?.bottomLabel || ''}
            </h5>

            {bins.map(({ color }, i) => (
              <div
                key={`horizontal-legend-${i}`}
                className='horizontal-legend-item'
                style={{
                  backgroundColor: color,
                  borderColor: config.strokeColor || 'black',
                  flexGrow: 1,
                  height: '.7rem',
                }}
              >
              </div>
            ))}
            <h5
              className='horizontal-legend-labels'
              style={{
                padding: '0 .5rem',
                maxWidth: '100px',
                textAlign: 'center',
              }}
            >
              {config?.horizontalLegend?.topLabel || ''}
            </h5>
          </div>
        )
      }

    </div>
    // ) : (
    //       <TailSpin
    //         color={'#006aaf'}
    //         width={200}
    //         height={200}
    //       />    // <div className='indicator-map-wrapper'>Loading...</div>
    // );
  )
};

IndicatorMap.propTypes = {
  config: PropTypes.object,
  geoJSON: PropTypes.object,
  project: PropTypes.string,
  getter: PropTypes.object
};

export default IndicatorMap;
