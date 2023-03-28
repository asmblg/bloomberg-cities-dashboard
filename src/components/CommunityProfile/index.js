import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Icon } from 'semantic-ui-react';

import IndicatorListSection from './subComponents/IndicatorListSection';
import DataMap from '../DataMap';
import DonutWithLegend from './subComponents/DonutWithLegend';
import LastUpdateIcon from '../LastUpdateIcon';
// import TrendPill from '../TrendPill';

import { getData, getTractGeoJSON } from '../../utils/API';
import getNestedValue from '../../utils/getNestedValue';
import getIndicatorConfigFromManifest from '../../utils/getIndicatorConfigFromManifest';
import infoIcon from '../../assets/icons/info.png';
import './style.css';

const CommunityProfile = ({ config, project, viewType, dataManifest }) => {
  const [communityData, setCommunityData] = useState(null);
  const [geoJSON, setGeoJSON] = useState(null);

  // const manifest = null;
  const mapConfig = config.sections.find(({ type }) => type === 'map');

  useEffect(() => {
    const dataPath = `data.${config.dataPath}`;
    getData(project, dataPath).then(({ data }) => {
      const [communityDataObj] = data;

      setCommunityData({
        updatedOn: communityDataObj.updatedOn,
        data: getNestedValue(communityDataObj, dataPath)
      });
    });
  }, [project, config.dataPath]);

  useEffect(() => {
    getTractGeoJSON(project).then(({ data }) => {
      const geoJsonData = data[0];
      setGeoJSON(geoJsonData);
      // // Creating a indicator list without manifest for now
      // const indicators = geoJsonData
      //   ? Object.keys(geoJsonData.features[0].properties).filter(str => str !== 'GEOID')
      //   : null;

      // if (indicators) {
      //   setIndicators(indicators);
      //   setSelectedIndicator(indicators[0]);
      // }
    });
  }, [project]);

  return (
    <div className='cp-container'>
      <div className='cp-header'>
        <h4>{'2021 CENSUS AMERICAN COMMUNITY SURVEY DATA UPDATE'}</h4>
        {communityData?.updatedOn ? (
          <LastUpdateIcon date={communityData.updatedOn} width={'auto'} />
        ) : null}
      </div>
      <div className='cp-body'>
        {config.sections && config.sections[0]
          ? config.sections.map(({ config: c, type }, i) => (
            <div key={`cp-section-${type}-${i}`} className='cp-section'>
              {type === 'indicator-lists' ? (
                <IndicatorListSection config={c} data={communityData?.data || null} dataManifest={dataManifest} />
              ) : type === 'map' ? (
                geoJSON && communityData?.data ? (
                  <DataMap
                    dataManifest={dataManifest}
                    // indicator={selectedIndicator}
                    data={communityData.data}
                    mapConfig={mapConfig}
                    geoJSON={geoJSON}
                  />
                ) : null
              ) : type === 'donut-charts' && c.donuts && c.donuts[0] ? (
                c.donuts.map(({ title, indicators, colors }, i) => (
                  <div key={`cp-donut-${i}`} className='cp-chart-container'>
                    <div className='cp-chart-header'>
                      <h3>{title}</h3>
                      <img className='info-icon' src={infoIcon} />
                    </div>
                    <DonutWithLegend
                      title={title}
                      indicators={indicators.map(key => getIndicatorConfigFromManifest(dataManifest, key))}
                      data={communityData?.data || null}
                      colors={colors}
                      viewType={viewType}
                      startAngle={-270}
                      endAngle={90}
                    />
                  </div>
                ))
              ) : null}
            </div>
          ))
          : null}
      </div>
    </div>
  );
};

CommunityProfile.propTypes = {
  config: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  dataManifest: PropTypes.array
};

export default CommunityProfile;
