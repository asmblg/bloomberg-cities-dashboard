import React from 'react';

import shareIcon from './images/share_icon.png';
import printIcon from './images/print_icon.png';
import './style.css';

const OverviewCard = () => {
  const overviewConfig = {
    title: 'ECONOMIC DEVELOPMENT DASHBOARD',
    content: [
      {
        title: '',
        text: `${'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'.toUpperCase()}`
      },
      {
        title: 'Lorem ipsum dolor sit amet?',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    ]
  };

  return (
    <div className='overview-card'>
      <div className='edd-title overview-title bold-font'>{overviewConfig.title}</div>
      <div className='overview-body'>
        {overviewConfig.content.map(({ title, text }, i) => (
          <div key={`overview-body-content-${i}`}>
            {title ? <div>{title}</div> : null}
            {text ? <div>{text}</div> : null}
          </div>
        ))}
      </div>
      <div className='overview-icons'>
        <img src={shareIcon} onClick={() => console.log('share!')} />
        <img src={printIcon} onClick={() => console.log('print!')} />
      </div>
    </div>
  );
};

export default OverviewCard;
