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
const handleGeoJSON = async (geoJSON, indicators) => {
  const tempGeoJSON = { ...geoJSON };
  const featuresArr = tempGeoJSON.features.map(feature => {
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

const handleNoGeoJsonProp = async (project, geoType, indicators) => {
  try {
    if (project && geoType && indicators?.[0]) {
      const { data } = await getGeoJSON(project, geoType);
      // console.log(data);
      const returnedGeoJSON = data[0];
      const updatedGeoJSON = await handleGeoJSON(returnedGeoJSON, indicators);
      return updatedGeoJSON;
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
const handleBinning = ({ geoJSON, colors, indicator, numOfBins }) => {
  const binArray = [];
  const pRange = Math.floor(100 / numOfBins);

  const valueArray = geoJSON.features
    .map(feature => parseFloat(feature.properties[indicator]))
    .sort((a, b) => a - b);

  for (let i = 0; i < numOfBins; i++) {
    let p = null;
    const m = i + 1;
    if (i !== numOfBins - 1) {
      p = percentile(pRange * m, valueArray);
    } else p = percentile(100, valueArray);

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
