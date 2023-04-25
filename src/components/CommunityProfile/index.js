import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import IndicatorListSection from './subComponents/IndicatorListSection';
import IndicatorMap from '../IndicatorMap';
import DonutWithLegend from './subComponents/DonutWithLegend';
import InfoIcon from '../InfoIcon';
// import TrendPill from '../TrendPill';

import getAllNestedValuesByYear from '../../utils/getNestedValueByMostRecentYear';
import { getTractGeoJSON } from '../../utils/API';
import './style.css';

const CommunityProfile = ({ config, detailData, project, viewType }) => {
  const [geoJSON, setGeoJSON] = useState(null);
  const [cpData, setCpData] = useState(null);

  useEffect(() => {
    getTractGeoJSON(project).then(({ data }) => {
      const geoJsonData = data[0];
      setGeoJSON(geoJsonData);
    });
  }, [project]);

  useEffect(() => {
    if (detailData?.data) {
      const dataObj = getAllNestedValuesByYear(detailData.data);
      setCpData(dataObj);
    }
  }, [detailData]);

  return (
    <div className='cp-container'>
      <div className='cp-body'>
        {config.sections && config.sections[0]
          ? config.sections.map(({ config: c, type }, i) => (
            <div key={`cp-section-${type}-${i}`} className='cp-section'>
              {type === 'indicator-lists' ? (
                <IndicatorListSection config={c} data={cpData || null} />
              ) : type === 'map' ? (
                geoJSON && detailData?.data ? (
                  <IndicatorMap config={c} geoJSON={geoJSON} />
                ) : null
              ) : type === 'donut-charts' && c.donuts && c.donuts[0] ? (
                c.donuts.map(({ title, indicators, colors, description, source }, i) => (
                  <>
                    <div key={`cp-donut-${i}`} className='cp-chart-container'>
                      <div className='cp-chart-header'>
                        <h3>{title.toUpperCase()}</h3>
                        <InfoIcon config={{ description, source }} />
                      </div>
                      <DonutWithLegend
                        title={title}
                        indicators={indicators}
                        data={cpData || null}
                        colors={colors}
                        viewType={viewType}
                        startAngle={-270}
                        endAngle={90}
                      />
                    </div>
                    {i !== c.donuts.length - 1 ? (
                      <div className={'cp-donut-separator'}></div>
                    ) : null}
                  </>
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
  detailData: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string
};

export default CommunityProfile;
