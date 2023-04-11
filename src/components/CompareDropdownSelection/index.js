import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const CompareDropdownSelection = ({ config, getter, setter }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { title, projectCity, defaultSelected, compareCities, getterKey, setterKey } = config;
  const selectedOption = getterKey && getter[getterKey] ? getter[getterKey] : defaultSelected;

  return (
    <div className='compare-dropdown-container'>
      <h5 className='bold-font'>{title || ''}</h5>
      <div className='compare-dropdown-legend'>
        <div className='main-value-container'>
          <h5>{projectCity?.text || ''}</h5>
          <svg className='main-value-svg' height={'15px'} width={'15px'}>
            <rect height={'15px'} width={'15px'} />
          </svg>
        </div>
        <div className='option-selection-container'>
          <div className='option-selector' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div>
              <Icon name='angle down' size='big' />
              <h5>{selectedOption.text}</h5>
            </div>
            {selectedOption.key && selectedOption.key !== 'default' ? (
              <svg className='selected-option-svg' height={'15px'} width={'15px'}>
                <rect height={'15px'} width={'15px'} />
              </svg>
            ) : null}
          </div>
          {dropdownOpen ? (
            <ul className='compare-options-container'>
              {compareCities && compareCities[0]
                ? compareCities.map((city, i) => (
                  <li
                    key={`compare-option-${city.key}-${i}`}
                    className={
                      selectedOption.key === city.key
                        ? 'compare-selected-option'
                        : 'compare-unselected-option'
                    }
                    style={{
                      borderBottom:
                        i !== compareCities.length - 1
                          ? '1px solid var(--secondary-gray-color)'
                          : 'none'
                    }}
                    onClick={() => {
                      setter(setterKey, city);
                      setDropdownOpen(false);
                    }}
                  >
                    <h5 className={selectedOption.key === city.key ? 'bold-font' : null}>
                      {city.text}
                    </h5>
                  </li>
                ))
                : null}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

CompareDropdownSelection.propTypes = {
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func
};

export default CompareDropdownSelection;
