import addCalculatedIndicatorToDataObj from '../../utils/addCalculatedIndicatorToDataObj';
import percentile from 'percentile';
import incrementDecimalNumber from '../../utils/incrementDecimalNumber';
import formatValue from '../../utils/formatValue';
import { getGeoJSON } from '../../utils/API';

/**
 * 
 * @param {object} geoJSON 
 * @param {array} indicators array of indicators from config
 * @returns {object} updated geoJSON with calculated indicators in every features properties object
 */
const handleGeoJSON = (geoJSON, indicators, filter, data, joinKey) => {
  const tempGeoJSON = { ...geoJSON };
  const featuresArr = tempGeoJSON.features
    .filter(feature => {
      if (filter) {
        if (filter.exclude) {
          const filterKey = filter.exclude.key;
          const excludeArray = filter.exclude.array;
          if (excludeArray?.includes(feature?.properties?.[filterKey])) {
            return false;
          }
        }
      }
      return true;
    })
    .map(feature => {
      if (indicators && indicators[0]) {
        console.log('Adding data', { indicators, feature, data, joinKey })
        if (joinKey) {
          indicators.forEach(indicator => {
            const dataObj = data?.[indicator?.dataPath]?.[feature.properties[joinKey]];
            const propertiesObj = addCalculatedIndicatorToDataObj(indicator, dataObj);
            feature.properties = { ...feature.properties, [indicator?.dataPath]: { ...propertiesObj } };
          });
        }
        else {
          indicators.forEach(indicator => {
            const propertiesObj = addCalculatedIndicatorToDataObj(indicator, feature.properties);
            feature.properties = propertiesObj;
          });
        }
      }

      console.log('Returning feature', { feature })
      return feature;
    });

  tempGeoJSON.features = featuresArr;
  return tempGeoJSON;
};

/**
 * 
 * @param {string} project - Project city name
 * @param {string} geoType - Geo type from config
 * @param {array} indicators - array of indicators to run calculations on and add to GeoJSON. If using a getter and only passing in one indicator to the component, wrap that getter indicator object in [ ] when passing in as a argument
 * @param {string} joinKey - key to join data with GeoJSON features
 */

const handleNoGeoJsonProp = async (project, geoType, indicators, filter, dataObject, joinKey) => {
  try {
    if (project && geoType) {
      const { data } = await getGeoJSON(project, geoType);
      // console.log(data);
      const returnedGeoJSON = data[0];
      if (indicators?.[0]) {
        const updatedGeoJSON = handleGeoJSON(returnedGeoJSON, indicators, filter, dataObject, joinKey);
        return updatedGeoJSON;
      }
      return returnedGeoJSON;
    }
    return null;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

/**
 * 
 * @param {object} geoJSON object
 * @param {array} colors array of color hex values to represent bins
 * @param {string} indicator string that represents indicator key
 * @param {number} numOfBins number of bins to create
 * @returns {array} bins array
 */
const handleBinning = ({ geoJSON, colors, indicator, numOfBins, manualBreaks, dataPath, aggregator, range }) => {
  const binArray = [];
  const pRange = Math.floor(100 / numOfBins);
  let extractedDate = null;

  const valueArray = geoJSON.features
    .map(feature => {
      // console.log(feature.properties)
      let val = feature.properties[indicator];
      if (aggregator === 'oldest') {
        const aggregatorKey = Object.keys(val).sort(dateKey => {
          const year = dateKey.split('-')[0];
          const quater = dateKey.split('-')[1]?.replace('Q', '');
          return (Number(year) * 4) + Number(quater);
        })?.[0]
        val = val[aggregatorKey];
        extractedDate = aggregatorKey;
      }

      if (aggregator === 'current') {
        const aggregatorKey = Object.keys(val).sort(dateKey => {
          const year = dateKey.split('-')[0];
          const quarter = dateKey.split('-')[1]?.replace('Q', '');
          if (!quarter) {
            return year * -1;
          } else {
            return (Number(year) * 4 + Number(quarter)) * -1;
          }
        })?.[0]
        val = val[aggregatorKey];
        extractedDate = aggregatorKey;
      }

      if (dataPath) {
        dataPath.split('.').forEach(path => {
          val = val?.[path] || null;
        });
      }

      return parseFloat(val)
    })
    .sort((a, b) => a - b);

  if (range) {
    valueArray.push(range[1]);
    valueArray.unshift(range[0]);
  }

  for (let i = 0; i < numOfBins; i++) {
    let p = manualBreaks?.[i] || null;
    const m = i + 1;
    if (!manualBreaks?.[i]) {
      if (i !== numOfBins - 1) {
        p = percentile(pRange * m, valueArray);
      } else p = percentile(100, valueArray);
    }

    binArray.push({
      label: '',
      percentile: p,
      color: colors[i],
      // date: extractedDate,
    });
  }

  const arrayWithLabels = [...binArray].map((obj, i) => {
    const prevValue = i !== 0 ? binArray[i - 1].percentile : 0;
    const currentValue = obj.percentile;

    if (i === 0 && prevValue !== currentValue) {
      obj.label = `0 - ${currentValue}`;
    } else if (i !== 0 && prevValue !== currentValue) {
      const isInt = Number.isInteger(prevValue);
      obj.label = `${!isInt ? incrementDecimalNumber(prevValue) : prevValue + 1} - ${currentValue}`;
    } else {
      obj.label = currentValue;
    }
    return obj;
  });
  // console.log(arrayWithLabels);
  return { arrayWithLabels, extractedDate };
};

const formatLegendLabel = (label, formatter) => {
  const splitStr = `${label || ''}`.split('-').map(str => formatValue(str.trim(), formatter));
  return splitStr.join(' - ');
};

export { handleBinning, handleGeoJSON, formatLegendLabel, handleNoGeoJsonProp };
