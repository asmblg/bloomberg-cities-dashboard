import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const IndicatorDropdown = ({ 
  setter, 
  getter, 
  config, 
  options, 
  selectedOption,
  viewLoaded, 
}) => {
  // console.log(config);
  // console.log(options);
  const dropdownRef = useRef();
  const key = config?.key;
  const superHeading = config?.superHeading;
  const delayInitialSetter = config?.delayInitialSetter;
  const optionsToggle = getter?.[config?.getterKey?.optionsToggle]  || config?.defaultDataToggle;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [subHeading, setSubHeading] = useState(null);

  const setterKey = config?.setterKey?.selectedOption || null;
  // const key = `indicator-selector-${selection?.label || getter?.[config?.getterKey?.selectedOption]?.label || 'no-selection'}-${subHeading || 'no-subheading'}-${superHeading || 'no-superheading'}`;
  const optionArray = options?.[optionsToggle] || options;

  useEffect( () => {
    if (selection !== selectedOption) {
      setSelection(selectedOption);
    }
  }, [selectedOption]);
  // console.log(optionArray);

  useEffect(() => {

    const value = selectedOption || optionArray?.[0];
    setSelection(value);
    setSubHeading(getter?.[config?.getterKey?.subHeading] || config?.subHeading);

  }, [
    getter?.[config?.getterKey?.selectedOption],
    getter?.[config?.getterKey?.subHeading],
    selectedOption?.var,
    viewLoaded,
    optionsToggle
  ]);

  useEffect(() => {

    if (
      selection && 
      getter?.[setterKey] !== selection && 
      setterKey
    ) {
      const ms = delayInitialSetter || 0; 
      //Math.floor(Math.random() * 51);
      // console.log(setterKey, selection);
      setTimeout(() => 
        setter(setterKey, selection),
      ms
      );
    }
  }, [
    getter?.[config?.getterKey?.selectedOption],
    selection,
    optionsToggle,
    viewLoaded
  ]);

  return (
    <div
      key={key}
      ref={dropdownRef} 
      className='dropdown-container'>
      <div className='dropdown-header' onClick={() => setDropdownOpen(!dropdownOpen)}>
        {optionArray?.[1] ? (
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
            subHeading || selection?.subHeading ?
              <h4>{`${subHeading || selection.subHeading}`.toUpperCase()}</h4>
              : null
          }
        </div>


      </div>
      {dropdownOpen && optionArray?.[1] ? (
        <ul className='dropdown-options-container'
        onMouseLeave={() => {
          if (dropdownOpen) {
            setTimeout(() => {
              setDropdownOpen(false);
            }, 500);
            // setDropdownOpen(false);
          }
        }
        }
        onMouseEnter={() => {
          if (dropdownOpen) {
            setTimeout(() => {
              setDropdownOpen(true);
            }, 200);
            // setDropdownOpen(false);
          }
        }}
        >
          {optionArray.map(option =>
            option && option.label && option.key ? (
              <li
                key={`indicator-dropdown-option-${option.key}`}
                className={selection?.key === option.key ? 'selected-option bold-font' : 'unselected-option'}
                onClick={() => {
                  if (selection?.key !== option.key && setter) {
                    // console.log(option);
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
  options: PropTypes.oneOfType([PropTypes.array,PropTypes.object]),
  viewLoaded: PropTypes.bool
};

export default IndicatorDropdown;
