// import { useRef} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.css';


const InfoCard = ({
  config,
  data
}) => {
  const { filter } = config;
  console.log({filter, data})
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

  return (
    // JSON.stringify(infoItems, null, 2)
    <div
      className='info-card-container'
      style={{
        gap: config.gap || '10px',
      }}
    >
      {
    infoItems.map((item, index) => (
      item.layout === 4 ? (
      <div
        key={`info-card-${index}`}
        className='info-card'
        style={{...config.cardStyle}}
      >
        <div className='info-card-text-container'>
        <h3 className='info-card-headline'>
          {item[config.headline]}
        </h3>
        <h5 className='info-card-annotation'>
          {item[config.annotation]}
        </h5>
        <h5 className='info-card-annotation'>
          {item[config.source]}
        </h5>
        </div>
        <Link 
          to={item[config.bigNumberURL]}
          target="_blank" 
          rel="noopener noreferrer"  
          className='info-card-link'
          style={{
            textDecoration: config.bigNumberURL ? 'underline' : 'none',
            textUnderlineOffset: '0.2em',
          }}
        >
        <h2 className='info-card-big-number'>
          <span style={{
            fontSize: 'smaller',
          }}>{config.bigNumberPreUnit}</span>{item[config.bigNumber]}{config.bigNumberPostUnit}
        </h2>
        </Link>

      </div>
    ): (
    <h1>Layout not yet supported</h1>
  )
  ))
    }
    </div>
  );
}

InfoCard.propTypes = {
  data: PropTypes.array.isRequired
};

export default InfoCard;