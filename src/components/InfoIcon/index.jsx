import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';

import SourceLink from '../SourceLink';

import './style.css';

const InfoIcon = ({ config, popup, onClick }) =>
  popup && (config?.Description || config?.Source) ? (
    <Popup
      key={`${
        config.Variable.split(' ').join('-') || config.Description?.split(' ').join('-')
      }-popup`}
      position='bottom center'
      trigger={<Icon name='info circle' className='info-icon' />}
      on='click'
      hideOnScroll
      closeOnDocumentClick
      closeOnEscape
      closeOnPortalMouseLeave
    >
      <Popup.Content className='info-icon-popup-container'>
        {config.Description ? <h5 className='info-icon-popup-text'>{config.Description}</h5> : null}

        {config.Geography ? (
          <div className='info-icon-text-container'>
            <h5 className='info-icon-popup-text'>Geography: {config.Geography}</h5>
            {/* <h5 className='info-icon-popup-text'></h5> */}
          </div>
        ) : null}
        {config.Source ? (
          <div className='info-icon-text-container' style={{ marginBottom: '0' }}>
            <h5 className='info-icon-popup-text'>Source: <SourceLink
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

InfoIcon.propTypes = {
  config: PropTypes.object,
  popup: PropTypes.bool,
  onClick: PropTypes.func
};

export default InfoIcon;
