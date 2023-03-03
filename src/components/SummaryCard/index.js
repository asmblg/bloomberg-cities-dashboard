import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SummaryCard = ({ config, project, sectionKey }) => {
  const { label } = config;

  return (
    <div>
      <h1>{label}</h1>
      <Link key={`link-${sectionKey}-detail`} to={`/${project}/${sectionKey}/detail`}>
        {'Detail'}
      </Link>
    </div>
  );
};

SummaryCard.propTypes = {
  config: PropTypes.object,
  project: PropTypes.string,
  sectionKey: PropTypes.string
};

export default SummaryCard;
