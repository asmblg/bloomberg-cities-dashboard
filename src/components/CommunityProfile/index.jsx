import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import IndicatorListSection from './subComponents/IndicatorListSection';
import IndicatorMap from '../IndicatorMap';
import DonutWithLegend from './subComponents/DonutWithLegend';
import UnderConstructionBox from '../UnderConstructionBox';

import { handleCpData } from './utils';
import { getTractGeoJSON } from '../../utils/API';
import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import './style.css';

const CommunityProfile = ({ config, detailData, project, viewType }) => {
  const [geoJSON, setGeoJSON] = useState(null);
  const [cpData, setCpData] = useState(null);
  const [yearKeys, setYearKeys] = useState(null);

  useEffect(() => {
    getTractGeoJSON(project).then(({ data }) => {
      const geoJsonData = data[0];
      setGeoJSON(geoJsonData);
    });
  }, [project]);

  useEffect(() => {
    if (detailData?.data) {
      const data = handleCpData(detailData.data);
      setCpData(data);
      setYearKeys(getMostRecentDateKeys(Object.keys(data), 2));
    }
  }, [detailData]);

  return (
    <div className='cp-container'>
      <div className='cp-body'>
        {config.sections && config.sections[0] && cpData
          ? config.sections.map(({ config: c, type }, i) => (
            <div key={`cp-section-${type}-${i}`} className='cp-section'>
              {type === 'indicator-lists' ? (
                <IndicatorListSection
                  config={c}
                  data={cpData || null}
                  yearKeys={yearKeys || null}
                />

              ) : type === 'map' ? (
                geoJSON && detailData?.data ? (
                  <IndicatorMap config={c} geoJSON={geoJSON} />
                ) : null
              ) : type === 'donut-charts' && c.donuts && c.donuts[0] ? (
                c.donuts.map(({ title, indicators, colors }, i) => (
                  <Fragment  key={`cp-donut-${i}`}>
                    <div className='cp-chart-container'>
                      <div className='cp-chart-header'>
                        <h3>{title.toUpperCase()}</h3>
                        {/* <InfoIcon config={{ description, source }} /> */}
                      </div>
                      <DonutWithLegend
                        title={title}
                        indicators={indicators}
                        data={yearKeys?.[0] && cpData?.[yearKeys[0]] ? cpData[yearKeys[0]] : null}
                        colors={colors}
                        viewType={viewType}
                        startAngle={-270}
                        endAngle={90}
                      />
                    </div>
                    {i !== c.donuts.length - 1 ? (
                      <div className={'cp-donut-separator'}></div>
                    ) : null}
                  </Fragment>
                ))
              ) : null}
            </div>
          ))
          : <UnderConstructionBox notInConfig />}
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
