import React, 
{ 
  useEffect, 
  // useRef 
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { Checkbox } from 'semantic-ui-react';

// import { handleSetter } from './utils';
import './style.css';

const TrendDataToggle = ({ 
  config, 
  getter, 
  setter, 
  viewLoaded 
}) => {
  // const [checked, setChecked] = useState(false);
  // const ref = useRef();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const lang = query.get('lng') || null;
  const isPt = lang === 'pt';
  const isSk = lang === 'sk';
  // const { toggleValue } = getter;
  const options = config?.options || 
  [
    {
      value: 'YtY',
      label: isPt ? 'Variação homóloga' : isSk ? 'Medziročná zmena' : 'Year-to-Year change',
      key: 'YtY'
    },
    {
      value: 'QtQ',
      label: isPt ? 'Variação trimestral' : isSk ? 'Medzikvartálna zmena' : 'Quarter-to-Quarter change',
      key: 'QtQ'
    },

  ];

  const text = config?.text;

  // console.log('TrendDataToggle - getter:', getter);

  const toggleValue = config?.getterKey?.global  
  ? query.get('trendValue') || 'QtQ'
  : getter?.[config?.getterKey?.toggleValue]
    ? getter?.[config.getterKey.toggleValue]
    : getter === options[1].value || getter === options[0].value
      ? getter
      : 'YtY';


  useEffect(() => {
    // console.log('TrendDataToggle - toggleValue:', toggleValue);
    if (config?.setterKey?.global) {
      window.location.search = {
        trendValue: toggleValue
      }
    } else {
      setter(config?.setterKey?.toggleValue, toggleValue);
    }
  }, [
    config?.options,
    viewLoaded,
    toggleValue,
    config
  ]);

  return (
    <div
      // ref={ref} 
      className='data-toggle-container'
    >
      { text 
        ? <p>{text}</p> 
        // : !config?.options
        //   ? <p className='default-data-toggle-text'>Compare with:</p>
        : null
      } 
      <div className='data-toggle'>
        <h5>{options[0].label}</h5>
        <label className='toggle-el'>
          <input
            type="checkbox"
            checked={(toggleValue && toggleValue === options[1].value) || false}
            onChange={(e) => {
              const checked = e.target.checked;
              if (config?.setterKey?.toggleValue) {
                setter(config.setterKey.toggleValue, checked ? options[1].value : options[0].value);
              } else {
                setter(checked ? options[1].value : options[0].value);
              }
            }}
          />
          <span className="toggle-slider"></span>
        </label>
        <h5>{options[1]?.label}</h5>      
      </div>
    </div>
  );
};

TrendDataToggle.propTypes = {
  config: PropTypes.object,
  getter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setter: PropTypes.func,
  viewLoaded: PropTypes.bool
};

export default TrendDataToggle;
