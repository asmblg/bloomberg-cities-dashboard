import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const IndicatorSelectDropdown = ({ selectedOption, setter, options }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // selectedOption && options objects must have a short_name property
  const text = selectedOption?.short_name || null;
  // selectedOption && options objects must have a key property
  const key = selectedOption?.key ? selectedOption.key : null;

  return text && key && setter && options && options[0] ? (
    <>
      <div className='dropdown-container'>
        <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
          <h3>{text}</h3>
        </div>
      </div>
      {dropdownOpen ? (
        <ul className='dropdown-options-container'>
          {options.map(option =>
            option && option.key && option.short_name ? (
              <li
                key={option.key}
                className={key === option.key ? 'selected-option bold-font' : 'unselected-option'}
                onClick={() => {
                  if (key !== option.key) {
                    setter(option);
                  }
                  setDropdownOpen(false);
                }}
              >
                {option.short_name || null}
              </li>
            ) : null
          )}
        </ul>
      ) : null}
    </>
  ) : null;
};

IndicatorSelectDropdown.propTypes = {
  selectedOption: PropTypes.object,
  setter: PropTypes.func,
  options: PropTypes.array
};

export default IndicatorSelectDropdown;
