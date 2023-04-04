import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

import './style.css';

const TrendDataToggle = ({ setTrendDataType }) => {
  const ref = useRef();
  return (
    <div ref={ref} className='data-toggle-container'>
      <h5>Year-to-Year</h5>
      <Checkbox toggle onChange={(e, { checked }) => setTrendDataType(checked ? 'QtQ' : 'YtY')} />
      <h5>Quarter-to-Quarter</h5>
    </div>
  );
};

TrendDataToggle.propTypes = {
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func
};

export default TrendDataToggle;
