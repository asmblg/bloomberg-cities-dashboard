import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import infoIcon from './icons/info.png';
import './style.css';

const InfoIcon = ({ source, variableDescription }) =>
  source || variableDescription ? (
    <Popup
      position='top center'
      on={'click'}
      trigger={<img className='info-icon' src={infoIcon} />}
    >
      <Popup.Content>
        {variableDescription ? (
          <h5 className='info-icon-description'>{variableDescription}</h5>
        ) : null}

        {source ? <h5>{`Source: ${source}`}</h5> : null}
      </Popup.Content>
    </Popup>
  ) : null;

InfoIcon.propTypes = {
  source: PropTypes.string,
  variableDescription: PropTypes.string
};

export default InfoIcon;
