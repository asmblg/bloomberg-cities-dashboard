import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import {useLocation} from 'react-router-dom';

import SourceLink from '../SourceLink';

import './style.css';

const InfoIcon = ({ config, popup, onClick }) => {
  const location = useLocation();
  const smallScreen = window.innerWidth < 768;
  const query = new URLSearchParams(location.search);
  const lang = query.get('lng') || null;



 return popup && (config?.Description || config?.Source) ? (
    <Popup
      key={`${
        config?.Variable?.split(' ')?.join('-') || config?.Description?.split(' ')?.join('-')
      }-popup`}
      position={'bottom right'}
      trigger={<Icon name='info circle' className='info-icon' />}
      on='click'
      hoverable={ !smallScreen }
      // inverted
      pinned
      openOnTriggerClick
      hideOnScroll
      size='tiny'
      closeOnDocumentClick
      closeOnEscape
      closeOnPortalMouseLeave
      style={{ 
        zIndex: '9999999', 
        position: 'relative', 
        left: '8px'
      }}
    >
      <Popup.Content className='info-icon-popup-container'>
        {config?.Description ? <h5 className='info-icon-popup-text'>{config.Description}</h5> : null}

        {config?.Geography ? (
          <div className='info-icon-text-container'>
            <h5 className='info-icon-popup-text'>
              <span style={{
              fontFamily: 'var(--font-family-bold)'
            }}>{lang === 'pt' ? 'Geografia:': 'Geography:'}</span> {config?.Geography}</h5>
            {/* <h5 className='info-icon-popup-text'></h5> */}
          </div>
        ) : null}
        {config?.Source ? (
          <div className='info-icon-text-container' style={{ marginBottom: '0' }}>
            <h5 className='info-icon-popup-text'>
            <span style={{
              fontFamily: 'var(--font-family-bold)'
            }}>{lang === 'pt' ? 'Fonte:' :'Source:'}</span> <SourceLink
              source={config.Source || null}
              link1={config.Source_link || null}
              link2={config.Source_link_2 || null}
            /></h5>

          </div>
        ) : null}
      </Popup.Content>
    </Popup>
  ) : (
    <div onClick={() => (onClick ? onClick() : null)}>
      <Icon name='info circle' className='info-icon' />
    </div>
  );
}
InfoIcon.propTypes = {
  config: PropTypes.object,
  popup: PropTypes.bool,
  onClick: PropTypes.func
};

export default InfoIcon;
