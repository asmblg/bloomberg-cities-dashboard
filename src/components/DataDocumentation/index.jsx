import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const DataDocumentation = ({ config }) => (
  <div id='docs-container'>
    <div className='docs-title'>
      <h1>{config?.title || '404'}</h1>
    </div>
    <div className='docs-body'>
      <p>{config?.body || 'No documentation available for this project.'}</p>
    </div>
  </div>
);

DataDocumentation.propTypes = {
  config: PropTypes.object
};

export default DataDocumentation;
