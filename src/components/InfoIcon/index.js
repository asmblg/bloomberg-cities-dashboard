import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import infoIcon from './icons/info.png';
import './style.css';

const InfoIcon = ({ config }) =>
  config?.variableDescription || config?.source ? (
    <Popup
      position='top center'
      on={'click'}
      trigger={<img className='info-icon' src={infoIcon} />}
    >
      <Popup.Content>
        {config.description ? (
          <h5 className='info-icon-description'>{config.description}</h5>
        ) : null}

        {config.source ? <h5>{`Source: ${config.source}`}</h5> : null}
      </Popup.Content>
    </Popup>
  ) : null;

InfoIcon.propTypes = {
  config: PropTypes.object
};

export default InfoIcon;
