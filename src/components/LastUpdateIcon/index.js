import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import greenDotIcon from './images/update_dot_green.png';
import './style.css';

const LastUpdateIcon = ({ date, width }) =>
  date ? (
    <div
      className='updated-date-title half-opacity'
      style={{
        width
      }}
    >
      <img src={greenDotIcon} />
      {/* New date in moment removes not recognized ISO format deprecation warning */}
      <div>Last Updated: {moment(new Date(date)).format('MM/DD/YYYY')}</div>
    </div>
  ) : null;

LastUpdateIcon.propTypes = {
  date: PropTypes.string,
  width: PropTypes.string
};

export default LastUpdateIcon;
