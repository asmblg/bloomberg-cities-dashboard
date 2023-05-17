import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';

import './style.css';

const InfoIcon = ({ config, popup, onClick }) =>
  popup && (config?.variableDescription || config?.source) ? (
    <Popup
      position='top center'
      on={'click'}
      trigger={<Icon name='info circle' className='info-icon' />}
    >
      <Popup.Content>
        {config.description ? (
          <h5 className='info-icon-description'>{config.description}</h5>
        ) : null}

        {config.source ? <h5>{`Source: ${config.source}`}</h5> : null}
      </Popup.Content>
    </Popup>
  ) : (
    <div onClick={() => onClick ? onClick() : null}>
      <Icon name='info circle' className='info-icon' />
    </div>
  );

InfoIcon.propTypes = {
  config: PropTypes.object,
  popup: PropTypes.bool,
  onClick: PropTypes.func
};

export default InfoIcon;
