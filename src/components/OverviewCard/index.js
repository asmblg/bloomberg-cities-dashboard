import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import DashboardTitle from '../DashboardTitle';
import './style.css';

const OverviewCard = ({ viewType, config }) => {
  const [overviewOpen, setOverviewOpen] = useState(true);

  return (
    <>
      {overviewOpen && config ? (
        <>
          {viewType === 'desktop' ? (
            <div className='overview-title'>
              <DashboardTitle title={config.title} fontSize={'3rem'} />
            </div>
          ) : null}

          <div className='overview-body'>
            {config.content.map(({ style, lines }, i) => (
              <div key={`overview-body-content-${i}`} style={style || {}}>
                {lines?.[0]
                  ? lines.map(({ text, style: lineStyle }, ii) => (
                    <div key={`overview-content-${i}-line-${ii}`} style={lineStyle || {}}>{text}</div>
                  )) : null}
              </div>
            ))}
          </div>
        </>
      ) : null}
      {viewType !== 'desktop' ? (
        <div className='overview-arrow-container'>
          <Icon
            name={`angle ${overviewOpen ? 'up' : 'down'}`}
            size='big'
            link
            onClick={() => setOverviewOpen(!overviewOpen)}
          />
        </div>
      ) : null}
    </>
  );
};

OverviewCard.propTypes = {
  viewType: PropTypes.string,
  config: PropTypes.object
};

export default OverviewCard;
