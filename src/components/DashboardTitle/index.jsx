import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const DashboardTitle = ({ title, fontSize }) => {
  const titleArr = title.split(' ');

  return (
    <h1 className='dashboard-title bold-font' style={fontSize ? { fontSize } : {}}>
      {titleArr.length > 1
        ? titleArr.map(str => <span key={`title-span-${str}`}>{str}</span>)
        : title}
    </h1>
  );
};

DashboardTitle.propTypes = {
  title: PropTypes.string,
  fontSize: PropTypes.string
};

export default DashboardTitle;
