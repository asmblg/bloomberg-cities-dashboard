import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import '../style.css';

const IndicatorSelectDropdown = ({ selectedIndicator, setSelectedIndicator, indicators }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <div className='indicator-map-dropdown'>
        <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
          <h3>{selectedIndicator.short_name}</h3>
        </div>
      </div>
      {dropdownOpen ? (
        <ul className='dropdown-indicators-container'>
          {indicators.map(indicator => (
            <li
              key={indicator.dataKey}
              className={
                selectedIndicator.dataKey === indicator.dataKey
                  ? 'selected-indicator bold-font'
                  : 'unselected-indicator'
              }
              onClick={() => {
                if (selectedIndicator.dataKey !== indicator.dataKey) {
                  setSelectedIndicator(indicator);
                }
                setDropdownOpen(false);
              }}
            >
              {indicator.short_name || '-'}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

IndicatorSelectDropdown.propTypes = {
  selectedIndicator: PropTypes.object,
  setSelectedIndicator: PropTypes.func,
  indicators: PropTypes.array
};

export default IndicatorSelectDropdown;
