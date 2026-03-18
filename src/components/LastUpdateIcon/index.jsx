import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import greenDotIcon from './images/update_dot_green.png';
import './style.css';

const LastUpdateIcon = ({ date, width }) => {
  const location = typeof window !== 'undefined' ? window.location : null;
  const queryParams = location ? new URLSearchParams(location.search) : null;
  const lang = queryParams ? queryParams.get('lng') : null;
  const isPt = lang === 'pt';
  const isSk = lang === 'sk';

  return date ? (
    <div
      className='updated-date-title half-opacity'
      style={{
        width
      }}
    >
      <img src={greenDotIcon} />
      {/* New date in moment removes not recognized ISO format deprecation warning */}
      <div>
        {isSk ? 'Naposledy aktualizované:' : 'Last Updated:'}{' '}
        {moment(new Date(date)).locale(isPt || isSk ? lang : 'en').format('MM/DD/YYYY')}
      </div>
    </div>
  ) : null;
};

LastUpdateIcon.propTypes = {
  date: PropTypes.string,
  width: PropTypes.string
};

export default LastUpdateIcon;
