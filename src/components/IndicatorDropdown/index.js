import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const IndicatorDropdown = ({ 
  setter, 
  getter, 
  config, 
  options, 
  selectedOption,
  viewLoaded 
}) => {
  // const dropdownRef = useRef();
  const superHeading = config?.superHeading;
  const delayInitialSetter = config?.delayInitialSetter;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [subHeading, setSubHeading] = useState(null);

  const setterKey = config?.setterKey?.selectedOption || null;
  // const key = `indicator-selector-${selection?.label || getter?.[config?.getterKey?.selectedOption]?.label || 'no-selection'}-${subHeading || 'no-subheading'}-${superHeading || 'no-superheading'}`;

  useEffect(() => {

    const value = selectedOption || options?.[0];
    console.log('****1****', {
      value, 
      GetterSelectedOption: config?.getterKey?.selectedOption, 
      getter, 
      selectedOption: selectedOption, 
      options,
      viewLoaded
    });
    // if (!selection) {
    setSelection(value);

    // if (value && !getter?.[setterKey] && setterKey) {
    //   const ms = 50;// Math.floor(Math.random() * 51);
    //   setTimeout(() => 
    //     setter(setterKey, value), 
    //   ms
    //   );
    // }
    setSubHeading(getter?.[config?.getterKey?.subHeading] || config?.subHeading);
  }, [
    getter?.[config?.getterKey?.selectedOption],
    getter?.[config?.getterKey?.subHeading],
    selectedOption?.var,
    viewLoaded
  ]);

  useEffect(() => {

    if (selection && !getter?.[setterKey] && setterKey) {
      console.log('**Setter****', { 
        getterKey: config?.getterKey, 
        getter,
        setterKey,
        selection
      });
      const ms = delayInitialSetter || 0; 
      //Math.floor(Math.random() * 51);
      setTimeout(() => 
        setter(setterKey, selection),
      ms
      );
    }
  }, [
    getter?.[config?.getterKey?.selectedOption],
    selection,
    // setterKey,
  ]);

  return (
    <div
      className='dropdown-container'
      // key={key}
    // ref={dropdownRef}
    >
      <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>
        {options?.[1] ? (
          <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
        ) : null}
        <div className='dropdown-header-label'>
          {
            superHeading ?
              <h4>{`${superHeading}`.toUpperCase()}</h4>
              : null
          }
          <h4>
            {
              `${selection?.label || getter?.[config?.getterKey?.selectedOption]?.label || ''}`.toUpperCase()
            }
          </h4>
          {
            subHeading ?
              <h4>{`${subHeading}`.toUpperCase()}</h4>
              : null
          }
        </div>


      </div>
      {dropdownOpen && options?.[1] ? (
        <ul className='dropdown-options-container'>
          {options.map(option =>
            option && option.label && option.key ? (
              <li
                key={`indicator-dropdown-option-${option.key}`}
                className={selection?.key === option.key ? 'selected-option bold-font' : 'unselected-option'}
                onClick={() => {
                  if (selection?.key !== option.key && setter) {
                    setSelection(option);
                    setter(setterKey, option);
                  }
                  setDropdownOpen(false);
                }}
              >
                {option.label || null}
              </li>
            ) : null
          )}
        </ul>
      ) : null}
    </div>
  );
  // : null;
};

IndicatorDropdown.propTypes = {
  selectedOption: PropTypes.object,
  setter: PropTypes.func,
  getter: PropTypes.object,
  config: PropTypes.object,
  options: PropTypes.array,
  viewLoaded: PropTypes.bool
};

export default IndicatorDropdown;
