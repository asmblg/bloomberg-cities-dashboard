import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import IndicatorListSection from './subComponents/IndicatorListSection';
import IndicatorMap from '../IndicatorMap';
import DonutWithLegend from './subComponents/DonutWithLegend';
import InfoIcon from '../InfoIcon';
// import TrendPill from '../TrendPill';

import { getTractGeoJSON } from '../../utils/API';
import './style.css';

const CommunityProfile = ({ config, data, project, viewType, dataManifest }) => {
  const [geoJSON, setGeoJSON] = useState(null);

  useEffect(() => {
    getTractGeoJSON(project).then(({ data }) => {
      const geoJsonData = data[0];
      setGeoJSON(geoJsonData);
    });
  }, [project]);

  return (
    <div>
      <div className='cp-container'>
        <div className='cp-body'>
          {config.sections && config.sections[0]
            ? config.sections.map(({ config: c, type }, i) => (
              <div key={`cp-section-${type}-${i}`} className='cp-section'>
                {type === 'indicator-lists' ? (
                  <IndicatorListSection
                    config={c}
                    data={data?.data || null}
                    dataManifest={dataManifest}
                  />
                ) : type === 'map' ? (
                  geoJSON && data?.data ? (
                    <IndicatorMap
                      dataManifest={dataManifest}
                      config={c}
                      geoJSON={geoJSON}
                    />
                  ) : null
                ) : type === 'donut-charts' && c.donuts && c.donuts[0] ? (
                  c.donuts.map(({ title, indicators, colors }, i) => (
                    <div key={`cp-donut-${i}`} className='cp-chart-container'>
                      <div className='cp-chart-header'>
                        <h3>{title}</h3>
                        <InfoIcon variableDescription={'A description...'} />
                      </div>
                      <DonutWithLegend
                        title={title}
                        indicators={indicators.map(key => dataManifest.indicators[key])}
                        data={data?.data || null}
                        colors={colors}
                        viewType={viewType}
                        startAngle={-270}
                        endAngle={90}
                      />
                      {i !== c.donuts.length - 1 ? (
                        <div className={'cp-donut-separator'}></div>
                      ) : null}
                    </div>
                  ))
                ) : null}
              </div>
            ))
            : null}
        </div>
      </div>
    </div>
  );
};

CommunityProfile.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  dataManifest: PropTypes.object
};

export default CommunityProfile;
