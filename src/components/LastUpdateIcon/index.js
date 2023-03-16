import React from 'react';
import PropTypes from 'prop-types';

import greenDotIcon from './images/update_dot_green.png';
import './style.css';

const LastUpdateIcon = ({ date, width }) => (
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

LastUpdateIcon.propTypes = {
  date: PropTypes.string,
  width: PropTypes.string
};

export default LastUpdateIcon;
