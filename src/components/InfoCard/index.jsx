// import { useRef} from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import icons from './icons'
import './style.css';
import SimpleLineChart from '../SimpleLineChart.js';
import InfoIcon from '../InfoIcon';


const InfoCard = ({
  config,
  data,
  stats
}) => {
  const { filter } = config;
  const infoItems = data.filter(item => {
    if (filter) {
      const booleanArray = [];
      Object.entries(filter).forEach(([key, value]) => {
        if (item[key] === value) {
          booleanArray.push(true);
        } else {
          booleanArray.push(false);
        }
      });
      return booleanArray.every(item => item === true);
    } else {
      return true;
    }

  });

  // console.log('infoItems', infoItems);
  // console.log('config', config);
  const smallScreen = window.innerWidth < 786

  return (
    // JSON.stringify(infoItems, null, 2)
    <div
      className='info-card-container'
      style={{
        gap: config.gap || '10px',
        flexDirection: config.direction || 'column',
        minWidth: !smallScreen 
          ? config.cardStyle?.width || '100%'
          : '300px',
        flexWrap: config.wrap || 'wrap',
        display: 'flex'
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
      }}
    >
      {
        infoItems.map((item, index) => (
          <div
            key={`info-card-${index}`}
            className='info-card'
            style={{ 
              ...config.cardStyle,
              minWidth: !smallScreen 
              ? config.cardStyle?.width || '100%'
              : '300px',
            }}
          >
            {
              
              item.layout === 1 ? (
                  <div 
                    className='info-card-text-container' 
                    style={{
                      maxWidth: '100%',
                    }}
                  >
                    <h4 className='info-card-headline' 
                      style={{
                        width: '100%',
                        paddingRight: '0px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      {item[config.headline]}
                      <InfoIcon 
                        config={{
                          Description: item?.description,
                          Source: item?.source,
                          Source_link: item?.['source link'],
                        }}
                        popup 
                      /> 
                    </h4>
                    <h5 className='info-card-annotation'>
                      {item[config.annotation]}
                    </h5>
                    <div className='info-card-chart'>
                    {/* { JSON.stringify(stats?.[item?.data] || {})} */}
                    <SimpleLineChart
                      config={config}
                      data={stats?.[item?.data] || {}}
                      margin={{ top: 15, right: 60, bottom: 0, left: 0 }}
                      height={config?.chart?.height || 80}
                      width={config?.chart?.width || '100%'}
                    />                    
                    </div>
                  </div>
              ) : item.layout === 2 ? (
                <>
                  <div className='info-card-icon-container'>
                    <img
                      src={icons[item.icon]}
                      alt={item.icon}
                      className='info-card-icon'
                      style={{

                        width: config.iconSize || '50px',
                        height: config.iconSize || '50px',
                      }}
                    />
                  </div>
                  <div className='info-card-text-container'
                    style={{
                      maxWidth: `calc(${config.cardStyle.width || '100%'} - 20px)`,
                      paddingLeft: '10px'
                    }}
                  >
                    <h4 
                      className='info-card-headline'
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '10px'
                        // marginRight: '10px',
                        // marginLeft: '10px',
                      }}
                    >
                      {item[config.headline]}
                      <InfoIcon 
                        config={{
                          Description: item?.description,
                          Source: item?.source,
                          Source_link: item?.['source link'],
                        }}
                        popup 
                      /> 
                    </h4>
                    <h5 className='info-card-annotation'>
                      {item[config.annotation]}
                    </h5>
                    <h5 className='info-card-annotation'>
                      {item[config.source]}
                    </h5>
                  </div>
                </>
              ) : item.layout === 3 ? (
                <>
                  <div className='info-card-icon-container'
                    style={{
                      gap: config.gap || '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginRight: '-30px',
                      paddingTop: '5px'
                    }}
                  >
                    <img
                      src={icons[item.icon]}
                      alt={item.icon}
                      className='info-card-icon'
                      style={{

                        width: config.iconSize || '50px',
                        height: config.iconSize || '50px',
                      }}
                    />
                    <InfoIcon 
                        config={{
                          Description: item?.description,
                          Source: item?.source,
                          Source_link: item?.['source link'],
                        }}
                        popup 
                      /> 
                  </div>
                  <div className='info-card-text-container'
                    style={{
                      maxWidth: `calc(${config.cardStyle.width || '100%'} - 10px)`,
                      padding: '0 5px'
                    }}
                  >
                    <h5 className='info-card-annotation'
                      style={{
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      {item[config.source]}
                    </h5>
                    <h4 className='info-card-headline'
                      style={{
                        maxWidth: `calc(${config.cardStyle.width || '100%'} - 20px)`,
                        textAlign: 'center',
                        paddingBottom: '5px'
                      }}
                    >
                      {item[config.headline]}
                    </h4>
                  </div>
                </>
              ) : item.layout === 4 ? (
                <>
                  <div className='info-card-text-container'                  >
                    
                    <h4 className='info-card-headline'>
                      {item[config.headline]}
                    </h4>
                    <h5 className='info-card-annotation'>
                      {item[config.annotation]}
                    </h5>
                    <Link
                    to={item[config.bigNumberURL]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='info-card-link'
                    style={{
                      // textDecoration: config.bigNumberURL ? 'underline' : 'none',
                      // textUnderlineOffset: '0.2em',
                    }}
                  >
                    <h5 className='info-card-annotation' 
                    style={{                      
                      color: 'rgb(51, 153, 204)'
            }}>
                      {item[config.source]}
                    </h5>
                    </Link>

                  </div>
                  

                    <h2 
                      className='info-card-big-number'
                      style={{
                        display: 'flex', 
                        flexDirection: 'row',
                        gap: '5px',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <div>
                      <span style={{
                        fontSize: 'smaller',
                      }}>{config.bigNumberPreUnit}</span>{item[config.bigNumber]}{config.bigNumberPostUnit}
                      </div>
                      <div style={{
                        position: 'relative',
                        bottom: '5px',
                        marginLeft: '0px' 
                      }}>
                        <InfoIcon 
                          config={{
                            Description: item?.description,
                            Source: item?.source,
                            Source_link: item?.['source link'],
                          }}
                          popup 
                        /> 
                      </div>

                    </h2>
                </>
              ) : <h1>Layout not yet supported</h1>
            }


          </div>
        )
        )
      }
    </div>
  );
}

InfoCard.propTypes = {
  data: PropTypes.array.isRequired
};

export default InfoCard;