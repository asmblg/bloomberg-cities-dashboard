import React from 'react';
import PropTypes from 'prop-types';

const Legend = ({ indicator, bins }) => {
  const sortedBins = [...bins].sort((a, b) => parseFloat(b.percentile) - parseFloat(a.percentile));
  return (
    <div className='map-legend'>
      <h4>{indicator}</h4>
      <ul className='legend-bins'>
        {sortedBins.map(({ color, label }) => (
          <li key={`legend-bin-${color}`} className='legend-bin'>
            <svg height={'15px'} width={'15px'}>
              <rect height={'15px'} width={'15px'} fill={color} />
            </svg>
            <h5>{label}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
};

Legend.propTypes = {
  indicator: PropTypes.string,
  bins: PropTypes.array
};

export default Legend;
