import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import infoIcon from './icons/info.png';
import './style.css';

const InfoIcon = ({ source, variableDescription }) => (
  <Popup position='top center' on={'click'} trigger={<img className='info-icon' src={infoIcon} />}>
    {/* This ternary will move above Popup when sources/descriptions are available so that an empty box will not show when a source or description is unavailable */}
    {source || variableDescription ? (
      <Popup.Content>
        {variableDescription ? (
          <h5 className='info-icon-description'>{variableDescription}</h5>
        ) : null}

        {source ? <h5>{`Source: ${source}`}</h5> : null}
      </Popup.Content>
    ) : null}
  </Popup>
);

InfoIcon.propTypes = {
  source: PropTypes.string,
  variableDescription: PropTypes.string
};

export default InfoIcon;
