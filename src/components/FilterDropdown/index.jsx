import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './style.css';

const FilterDropdown = ({
  setter,
  getter,
  config,
  options,
  // selectedOption,
  viewLoaded,
}) => {
  // console.log(config
  // console.log(options);
  const dropdownRef = useRef();
  // const key = config?.key;
  // const superHeading = config?.superHeading;
  const delayInitialSetter = config?.delayInitialSetter;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [subHeading, setSubHeading] = useState(null);
  const [localSelection, setLocalSelection] = useState(null);
  // const [deactivateSetter, setDeactivateSetter] = useState(false);
  const setterKey =  config?.setterKey?.filter || 
    config?.setterKey?.filter1 ||
    config?.setterKey?.filter2 ||
    config?.setterKey?.filter3;

  const getterKey = config?.getterKey?.selectedOption || null;
  const optionsToggle = getter?.[config?.getterKey?.optionsToggle] || config?.defaultDataToggle;


  const optionsArray = options?.[optionsToggle] || options;
  // const key = `indicator-selector-${selection?.label || getter?.[config?.getterKey?.selectedOption]?.label || 'no-selection'}-${subHeading || 'no-subheading'}-${superHeading || 'no-superheading}`; const optionArray = options?.[optionsToggle] || options;    

  // const handleDropdownClick = () => {
  //   setDropdownOpen(!dropdownOpen);
  //   setter(setterKey, selection);
  // }


    useEffect(() => {
      if (config?.getterKey?.activeFilter) {
        const activeFilter = getter?.[config?.getterKey?.activeFilter];
        const matchingOption = options?.filter(({ value, key }) => (
          key === activeFilter ||
          value === activeFilter ||
          key === activeFilter?.key ||
          value === activeFilter?.value
        ))?.[0];
        if (!matchingOption) {
          setLocalSelection(options?.[0]);
        } else {
          setLocalSelection(null);
          setSelection(matchingOption);
        }
      }
    }, [getter?.[config?.getterKey?.activeFilter]]);
  
  useEffect(() => {
    if (
      selection &&
      getter?.[getterKey] !== selection &&
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
    getter?.[config?.getterKey?.optionsToggle],
    selection,
    optionsToggle,
    viewLoaded
  ]);

  useEffect(() => {
    if (selection !== getter?.[getterKey]) {
      setSelection(getter?.[getterKey]);
    }
  }
    , [getter?.[getterKey]]);
    
  useEffect(() => { 
    const value = getter?.[getterKey] || optionsArray?.[0];
    setSelection(value);
  }, [getter?.[getterKey], optionsArray, viewLoaded, optionsToggle]);  

  return (
    <div className="dropdown-container" ref={dropdownRef}>

      <div 
        style={{...config?.headerStyle || {}}}
        className='dropdown-header' 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onMouseLeave={() => {
          if (dropdownOpen) {
            setTimeout(() => {
              setDropdownOpen(false);
            }, 200);
            // setDropdownOpen(false);
          }
        }
        }
      >
        <Icon name={!dropdownOpen ? 'angle down' : 'angle up'} size='big' />
        <div className='dropdown-header-label'>
          <h4 className='simple-card-indicator-text'>
            {
              `${localSelection?.label || selection?.label || getter?.[config?.getterKey?.selectedOption]?.label || ''}`.toUpperCase()
            }
          </h4>
          {
            subHeading || localSelection?.subHeading || selection?.subHeading ?
              <h4>{`${subHeading || localSelection?.subHeading || selection.subHeading}`.toUpperCase()}</h4>
              : null
          }
        </div>


      </div>
      {dropdownOpen && (
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
          {optionsArray?.map(option =>
            option && option.label && option.key && (
              <li
                key={`indicator-dropdown-option-${option.key}`}
                className={ localSelection
                  ? localSelection?.key === option.key ? 'selected-option bold-font' : 'unselected-option'
                  : selection?.key === option.key ? 'selected-option bold-font' : 'unselected-option'}
                onClick={() => {
                  if (selection?.key !== option.key && setter) {
                    // console.log(option);
                    setSelection(option);
                  }
                  setDropdownOpen(false);
                }}
              >
                {option.label || null}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

FilterDropdown.propTypes = {
  setter: PropTypes.func,
  getter: PropTypes.object,
  config: PropTypes.object.isRequired,
  options: PropTypes.array,
  // selectedOption: PropTypes.object,
  viewLoaded: PropTypes.bool,
};
export default FilterDropdown;
// Compare this snippet from src/components/IndicatorMap/index.jsx: