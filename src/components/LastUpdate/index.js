import React from 'react';
import PropTypes from 'prop-types';

import greenDotIcon from './images/update_dot_green.png';
import './style.css';

const LastUpdate = ({ date, width }) => (
  <div
    className='updated-date-title half-opacity'
    style={{
      width
    }}
  >
    <img src={greenDotIcon} />
    <div>Last Updated {date}</div>
  </div>
);

LastUpdate.propTypes = {
  date: PropTypes.string,
  width: PropTypes.string
};

export default LastUpdate;
