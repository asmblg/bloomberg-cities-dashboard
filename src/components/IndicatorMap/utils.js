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
const handleGeoJSON = async (geoJSON, indicators, filter) => {
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
        indicators.forEach(indicator => {
          const propertiesObj = addCalculatedIndicatorToDataObj(indicator, feature.properties);
          feature.properties = propertiesObj;
        });
      }
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
 * @returns updated GeoJSON to be set into state
 */

const handleNoGeoJsonProp = async (project, geoType, indicators, filter) => {
  try {
    if (project && geoType ) {
      const { data } = await getGeoJSON(project, geoType);
      // console.log(data);
      const returnedGeoJSON = data[0];
      if (indicators?.[0]) {
        const updatedGeoJSON = await handleGeoJSON(returnedGeoJSON, indicators, filter);
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
  console.log(indicator)

  const valueArray = geoJSON.features
    .map(feature => {
      // console.log(feature.properties)
      let val = feature.properties[indicator];
      if (aggregator === 'current') {
        const aggregatorKey = Object.keys(val).sort(dateKey => {
          const year = dateKey.split('-')[0];
          const quater = dateKey.split('-')[1]?.replace('Q', '');
          return Number(year) + Number(quater);
        })?.[0]
        val = val[aggregatorKey];
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
      color: colors[i]
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
  return arrayWithLabels;
};

const formatLegendLabel = (label, formatter) => {
  const splitStr = `${label || ''}`.split('-').map(str => formatValue(str.trim(), formatter));
  return splitStr.join(' - ');
};

export { handleBinning, handleGeoJSON, formatLegendLabel, handleNoGeoJsonProp };
