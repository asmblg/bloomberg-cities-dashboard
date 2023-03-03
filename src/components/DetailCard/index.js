import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DetailCard = ({ config, project, sectionKey }) => {
  const { label } = config;

  return (
    <div>
      <h1>{label} - Detail Card</h1>
      <Link to={`/${project}/${sectionKey}`}>{'Summary'}</Link>
    </div>
  );
};

DetailCard.propTypes = {
  config: PropTypes.object,
  project: PropTypes.string,
  sectionKey: PropTypes.string
};

export default DetailCard;
