import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import ShareAndPrintIcons from '../ShareAndPrintIcons';
import './style.css';

const OverviewCard = ({ viewType }) => {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const overviewConfig = {
    title: 'ECONOMIC DEVELOPMENT DASHBOARD',
    content: [
      {
        title: 'CITY OF TAMPA ECONOMIC DATA.',
        text: 'UPDATED QUARTERLY.',
        type: 'overview'
      },
      {
        title: 'How to use this dashboard?',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        type: 'instructions'
      }
    ]
  };

  return (
    <div className='overview-card'>
      {overviewOpen ? (
        <>
          {viewType === 'desktop' ? (
            <div className='edd-title overview-title bold-font'>{overviewConfig.title}</div>
          ) : null}

          <div className='overview-body'>
            {overviewConfig.content.map(({ title, text, type }, i) => (
              <div key={`overview-body-content-${i}`}>
                {title ? (
                  <div className={type === 'instructions' ? 'bold-font' : 'thin-font'}>{title}</div>
                ) : null}
                {text ? <div className={'thin-font'}>{text}</div> : null}
              </div>
            ))}
          </div>
          {viewType === 'desktop' ? <ShareAndPrintIcons /> : null}
        </>
      ) : null}
      {viewType === 'mobile' ? (
        <div className='overview-arrow-container'>
          <Icon
            name={`angle ${overviewOpen ? 'up' : 'down'}`}
            size='big'
            link
            onClick={() => setOverviewOpen(!overviewOpen)}
          />
        </div>
      ) : null}
    </div>
  );
};

OverviewCard.propTypes = {
  viewType: PropTypes.string
};

export default OverviewCard;
