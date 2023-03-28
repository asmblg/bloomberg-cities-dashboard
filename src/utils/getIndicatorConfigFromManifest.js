/**
 *
 * @param {array} manifest Data manifest from database
 * @param {string} indicator Indicator key that configuration is needed for
 * @returns indicator configuration from data manifest
 */

const getIndicatorConfigFromManifest = (manifest, indicator) => {
  const indicatorConfig = manifest.find(({ dataKey }) => dataKey === indicator);
  // console.log(indicatorConfig, indicator);
  return indicatorConfig;
};

export default getIndicatorConfigFromManifest;
