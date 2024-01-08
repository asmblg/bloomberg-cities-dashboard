import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import getNestedValue from '../../utils/getNestedValue';
import { handleSearch } from './utils';
import './style.css';

const CompareDropdownSelection = ({
  config,
  // getter, 
  setter,
  data,
  options,
  enableSearch,
  dataToggle,
  selectedOption,
  indicatorWithDataPath,
  optionsResetTrigger
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectOptions, setSelectOptions] = useState(null);
  const [search, setSearch] = useState('');
  const compareDropdownRef = useRef();
  // const inputRef = useRef();
  const prevDataToggleRef = useRef();
  const prevOptionsResetTriggerRef = useRef();

  // const [loaded, setLoaded] = useState(false);

  // const enableSearch = config?.searchable;

  const {
    title,
    titles,
    comparand,
    manifest,
    manifests,
    // defaultSelected,
    // options,
    optionsDataPath,
    optionsDataPaths,
    // getterKey,
    setterKey,
    style,
    svgStyle,
    legendStyle,
    // defaultDataToggle,
    // key,
    // delayInitialSetter
  } = config;

  // const dataToggle = getter?.[config?.getterKey?.optionsToggle] || defaultDataToggle;
  // const selectedOption = getter?.[getterKey?.selectedOption] || defaultSelected;
  // const indicatorWithDataPath = getter?.[config?.getterKey?.indicatorWithDataPath];
  // const optionsResetTrigger = getter?.[getterKey?.optionsResetTrigger];


  useEffect(() => {
    const prevDataToggle = prevDataToggleRef.current;
    const prevOptionsResetTrigger = prevOptionsResetTriggerRef.current;

    if (
      // selectedOption !== getter?.[getterKey?.selectedOption] ||
      (selectOptions && !selectedOption) ||
      (prevDataToggle && prevDataToggle !== dataToggle) ||
      (prevOptionsResetTrigger && prevOptionsResetTrigger !== optionsResetTrigger) ||
      !dataToggle ||
      !prevDataToggle ||
      indicatorWithDataPath
    ) {
      // console.log(
      //   '*******',
      //   setterKey?.selectedOption,
      //   dataToggle,
      //   // selectedOption !== getter?.[getterKey?.selectedOption],
      //   (selectOptions && !selectedOption),
      //   (prevDataToggle && prevDataToggle !== dataToggle),
      //   (prevOptionsResetTrigger && prevOptionsResetTrigger !== optionsResetTrigger),
      //   !dataToggle,
      //   !prevDataToggle,
      //   indicatorWithDataPath
      // );

      if ((options?.[0] || options?.[dataToggle]?.[0]) && !optionsDataPath && !optionsDataPaths) {
        const optionsArr = options?.[0]
          ? options
          : options?.[dataToggle];

        // console.log('FIRST CONDITION', setterKey?.selectedOption, optionsArr[0]);

        setSearch('');
        setSelectOptions(optionsArr);

        if (
          setterKey?.selectedOption &&
          (
            !selectedOption ||
            prevDataToggle !== dataToggle ||
            prevOptionsResetTrigger !== optionsResetTrigger
          )
        ) {

          setter(setterKey.selectedOption, optionsArr[0]);

        }
      } else if ((optionsDataPath || optionsDataPaths || indicatorWithDataPath) && data) {

        const dataObj = getNestedValue(data, indicatorWithDataPath?.dataPath || optionsDataPath || optionsDataPaths?.[dataToggle]);
        const baseDataPath = indicatorWithDataPath?.dataPath || optionsDataPath || optionsDataPaths?.[dataToggle];
        const optionsArr = dataObj
          ? Object.keys(dataObj)
            .sort()
            .map(key => ({
              text: manifest?.[key] || manifests?.[dataToggle]?.[key] || key,
              key,
              dataPath: `${baseDataPath}.${key}`
            }))
          : null;


        if (optionsArr) {
          // console.log('SECOND CONDITION', setterKey?.selectedOption, optionsArr[0]);

          setSearch('');
          setSelectOptions(optionsArr);

          if (
            setterKey?.selectedOption &&
            (
              !selectedOption ||
              prevDataToggle !== dataToggle ||
              prevOptionsResetTrigger !== optionsResetTrigger
            )
          ) {
            // console.log(setterKey.selectedOption, optionsArr[0]);

            setter(setterKey.selectedOption, optionsArr[0]);
          }
        }
      }
      prevDataToggleRef.current = dataToggle;
      prevOptionsResetTriggerRef.current = optionsResetTrigger;
    }
  }, [
    selectedOption,
    dataToggle,
    indicatorWithDataPath,
    optionsResetTrigger,
    data,
    setter,
    options
    // selectedOption,
    // config,
    // getter?.[config?.getterKey?.optionsToggle]  
  ]);

  return (
    <div
      // key={key || title}
      ref={compareDropdownRef}
      className='compare-dropdown-container'
      style={style || {}}
    >
      <h4 className='bold-font'>{title || titles?.[dataToggle] || ''}</h4>
      <div className='compare-dropdown-legend' style={legendStyle || {}}>
        {comparand ? (
          <div className='main-value-container'>
            <h5>{comparand.text || ''}</h5>
            <svg className='main-value-svg' height={'15px'} width={'15px'}>
              <rect height={'15px'} width={'15px'} />
            </svg>
          </div>
        ) : null}

        {selectOptions?.[0] && selectedOption ? (
          <div className='option-selection-container'>
            <div className='option-selector' onClick={() => {
              if (!enableSearch) {
                setDropdownOpen(!dropdownOpen);
              }
            }}>
              <div>
                <div onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <Icon name={dropdownOpen ? 'angle up' : 'angle down'} size='big' />
                </div>
                {!enableSearch ? (
                  <h5>{selectedOption?.text || 'Unknown'}</h5>
                ) : (
                  <input
                    // ref={inputRef}
                    className='compare-dropdown-search'
                    // placeholder={selectedOption?.text}
                    value={search || selectedOption?.text}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => {
                      setSearch(' ');
                      if (!dropdownOpen) {
                        setDropdownOpen(true);
                      }
                    }}
                  />
                )}
              </div>

              {selectedOption.key && selectedOption.key !== 'default' ? (
                <svg className='selected-option-svg' height={'15px'} width={'15px'}>
                  <rect
                    height={'15px'}
                    width={'15px'}
                    style={svgStyle ? { fill: svgStyle.compareColor || svgStyle.mainColor } : {}}
                  />
                </svg>
              ) : null}
            </div>
            {dropdownOpen ? (
              <ul className='compare-options-container'>
                {selectOptions?.[0]
                  ? selectOptions
                    .filter(({ text }) => handleSearch(text, `${search}`.trim()))
                    .map((option, i) => (
                      <li
                        key={`compare-option-${option.key}-${i}-${title}`}
                        className={
                          selectedOption.key === option.key
                            ? 'compare-selected-option'
                            : 'compare-unselected-option'
                        }
                        style={{
                          borderBottom:
                            i !== selectOptions.length - 1
                              ? '1px solid var(--secondary-gray-color)'
                              : 'none'
                        }}
                        onClick={() => {
                          if (setterKey?.selectedOption) {
                            // if (onUpdate) {
                            //   onUpdate({
                            //     setterKey: setterKey.selectedOption,
                            //     selection: option
                            //   });
                            // }
                            setter(setterKey.selectedOption, option);
                          }
                          setSearch('');
                          setDropdownOpen(false);
                        }}
                      >
                        <h5 className={selectedOption.key === option.key ? 'bold-font' : null}>
                          {option.text}
                        </h5>
                      </li>
                    ))
                  : null}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

CompareDropdownSelection.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  getter: PropTypes.object,
  setter: PropTypes.func,
  dataToggle: PropTypes.string,
  selectedOption: PropTypes.object,
  indicatorWithDataPath: PropTypes.object,
  optionsResetTrigger: PropTypes.any,
  enableSearch: PropTypes.bool,
  options: PropTypes.array
};

export default CompareDropdownSelection;
