import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

import './style.css';

const TrendDataToggle = ({ trendDataType, setTrendDataType }) => {
  const ref = useRef();
  return (
    <div ref={ref} className='data-toggle-container'>
      <h5>Quarter-to-Quarter</h5>
      <Checkbox toggle checked={trendDataType === 'YtY'} onChange={(e, { checked }) => setTrendDataType(checked ? 'YtY' : 'QtQ')} />
      <h5>Year-to-Year</h5>
    </div>
  );
};

TrendDataToggle.propTypes = {
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func
};

export default TrendDataToggle;
