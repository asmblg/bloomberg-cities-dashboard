import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import IndicatorListSection from './subComponents/IndicatorListSection';
import DataMap from '../DataMap';
import DonutWithLegend from './subComponents/DonutWithLegend';
import LastUpdateIcon from '../LastUpdateIcon';
// import TrendPill from '../TrendPill';

import { getData, getTractGeoJSON } from '../../utils/API';
import getNestedValue from '../../utils/getNestedValue';
import infoIcon from '../../assets/icons/info.png';
import './style.css';

const CommunityProfile = ({ config, project, viewType }) => {
  const [communityData, setCommunityData] = useState(null);
  const [tractGeoJSON, setTractGeoJSON] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const manifest = null;
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
      const geoJSON = data[0];
      setTractGeoJSON(geoJSON);
      // Creating a indicator list without manifest for now
      const indicators = geoJSON
        ? Object.keys(geoJSON.features[0].properties).filter(str => str !== 'GEOID')
        : null;

      if (indicators) {
        setIndicators(indicators);
        setSelectedIndicator(indicators[0]);
      }
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
                <IndicatorListSection config={c} data={communityData?.data || null} />
              ) : type === 'map' ? (
                <div className='cp-map-wrapper'>
                  {selectedIndicator && indicators ? (
                    <>
                      <div className='cp-map-dropdown'>
                        <div
                          className='dropdown-header'
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
                          <h3>{selectedIndicator}</h3>
                        </div>
                      </div>
                      {dropdownOpen ? (
                        <ul className='dropdown-indicators-container'>
                          {indicators.map(indicator => (
                            <li
                              key={indicator}
                              className={
                                selectedIndicator === indicator
                                  ? 'selected-indicator bold-font'
                                  : 'unselected-indicator'
                              }
                              onClick={() => {
                                if (selectedIndicator !== indicator) {
                                  setSelectedIndicator(indicator);
                                }

                                setDropdownOpen(false);
                              }}
                            >
                              {indicator}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : null}
                  {selectedIndicator && tractGeoJSON && communityData?.data ? (
                    <DataMap
                      manifest={manifest}
                      indicator={selectedIndicator}
                      data={communityData.data[selectedIndicator]}
                      mapConfig={mapConfig}
                      tractGeoJSON={tractGeoJSON}
                    />
                  ) : null}
                </div>
              ) : type === 'donut-charts' && c.donuts && c.donuts[0] ? (
                c.donuts.map(({ title, indicators, colors }, i) => (
                  <div key={`cp-donut-${i}`} className='cp-chart-container'>
                    <div className='cp-chart-header'>
                      <h3>{title}</h3>
                      <img className='info-icon' src={infoIcon} />
                    </div>
                    <DonutWithLegend
                      title={title}
                      indicators={indicators}
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
  viewType: PropTypes.string
};

export default CommunityProfile;
