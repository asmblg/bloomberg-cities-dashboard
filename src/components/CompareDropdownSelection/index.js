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
  const [inputInFocus, setInputInFocus] = useState(false);
  const [search, setSearch] = useState('');
  const compareDropdownRef = useRef();
  const prevDataToggleRef = useRef();
  const prevOptionsResetTriggerRef = useRef();


  const {
    title,
    titles,
    comparand,
    manifest,
    manifests,
    optionsDataPath,
    optionsDataPaths,
    setterKey,
    style,
    svgStyle,
    legendStyle,
    delaySetter,
    key
  } = config;

  // console.log(key);

  useEffect(() => {
    const prevDataToggle = prevDataToggleRef.current;
    const prevOptionsResetTrigger = prevOptionsResetTriggerRef.current;
    if (key === 'vacancies-industry-occupation-selector' ) {
      console.log(dataToggle, prevDataToggle);
    }

    if (
      (selectOptions && !selectedOption) ||
      (prevDataToggle !== dataToggle) ||
      (prevOptionsResetTrigger !== optionsResetTrigger) ||
      !dataToggle ||
      !prevDataToggle ||
      !prevDataToggle === undefined ||
      indicatorWithDataPath
    ) {
      // console.log(
      //   '*******',
      //   setterKey?.selectedOption,
      //   dataToggle,
      //   (selectOptions && !selectedOption),
      //   ( prevDataToggle !== dataToggle),
      //   (prevOptionsResetTrigger !== optionsResetTrigger),
      //   !dataToggle,
      //   !prevDataToggle,
      //   indicatorWithDataPath || false
      // );

      if ((options?.[0] || options?.[dataToggle]?.[0]) && !optionsDataPath && !optionsDataPaths) {
        const optionsArr = options?.[0]
          ? options
          : options?.[dataToggle];

        // console.log('FIRST CONDITION', setterKey?.selectedOption, optionsArr[0]);

        setSearch('');
        setSelectOptions(
          optionsArr?.sort((a,b) => 
            a.text.localeCompare(b.text)
          )
        );

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

        const dataObj = getNestedValue(data, indicatorWithDataPath?.dataPath ||  optionsDataPaths?.[dataToggle] || optionsDataPath );
        const baseDataPath = indicatorWithDataPath?.dataPath || optionsDataPaths?.[dataToggle] || optionsDataPath ;
        const optionsArr = dataObj
          ? Object.keys(dataObj)
            .filter(key => key !== '00' && key !== '99')
            .map(key => ({
              text: manifest?.[key] || manifests?.[dataToggle]?.[key] || key,
              key,
              dataPath: `${baseDataPath}.${key}`
            }))
            .sort((a,b) => a.text.localeCompare(b.text))

          : null;


        if (optionsArr) {
          // console.log('SECOND CONDITION', setterKey?.selectedOption, optionsArr[0]);

          setSearch('');
          setSelectOptions(
            optionsArr?.sort((a,b) => 
              a.text.localeCompare(b.text)
            )
          );
          if (
            setterKey?.selectedOption &&
            (
              !selectedOption ||
              prevDataToggle !== dataToggle ||
              prevOptionsResetTrigger !== optionsResetTrigger
            )
          ) {

            if (delaySetter) {
              setTimeout(() => {
                // console.log('Delayed', setterKey.selectedOption, optionsArr[0]);
                setter(setterKey.selectedOption, optionsArr[0]);
              }, delaySetter);
            } else {
              // console.log(setterKey.selectedOption, optionsArr[0]);
              setter(setterKey.selectedOption, optionsArr[0]);
            }
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
  ]);
  // const randomNumber = Math.floor(Math.random() * 100);
  // const keyString = `${randomNumber}-${`${selectOptions?.[0]?.key}`.replace(/[ ,]/g, '-')}`;
  // console.log(selectOptions);

  return (
    <div
      key={key}
      ref={compareDropdownRef}
      className='compare-dropdown-container'
      style={style || {}}
      onMouseLeave={() => {
        setSearch('');
        setInputInFocus(false);
        setDropdownOpen(false);
      }}
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
                    className='compare-dropdown-search'
                    value={(search === ' ' || search === '') && inputInFocus
                      ? '' 
                      : search?.length > 0 
                        ? search 
                        : selectedOption?.text
                    }
                    placeholder={'Search...'}
                    onChange={e => {
                      setSearch(e.target.value);
                    }}
                    onFocus={() => {
                      setInputInFocus(true);
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
                        key={`compare-option-${option.key}-${i}-${key}`}
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
                            setter(setterKey.selectedOption, option);
                          }
                          setSearch('');
                          setInputInFocus(false);
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
