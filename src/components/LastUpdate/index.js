import React from 'react';
import PropTypes from 'prop-types';

import greenDotIcon from './images/update_dot_green.png';
import './style.css';

const LastUpdate = ({ date }) => (
  <div className='updated-date-title half-opacity'>
    <img src={greenDotIcon} />
    Last Updated {date}
  </div>
);

LastUpdate.propTypes = {
  date: PropTypes.string
};

export default LastUpdate;
