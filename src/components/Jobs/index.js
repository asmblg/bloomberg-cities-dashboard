import React from 'react';
import PropTypes from 'prop-types';

const Jobs = ({ config, data, project, dataManifest, viewType }) => {
  console.log({ config, data, project, dataManifest, viewType });
  return (
    <div className='jobs-wrapper'>
      {/* <div className='detail-title bold-font'>{config.label}</div> */}
    </div>
  );
};

Jobs.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  dataManifest: PropTypes.object
};

export default Jobs;
