import React from 'react';
import PropTypes from 'prop-types';

const UnderConstructionBox = ({ notInConfig, style, description }) => {
  const textStyle = {
    fontFamily: 'var(--font-family-regular)',
    opacity: '0.7',
    textAlign: 'center'
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: notInConfig ? '200px' : '100%',
        backgroundColor: '#F5F7F8',
        padding: '20px',
        margin: notInConfig ? '0 20px' : '0',
        gap: '10px',
        ...style
      }}
    >
      <h1 style={{ ...textStyle, marginBottom: '5px' }}>{'UNDER CONSTRUCTION'}</h1>
      {/* <h2 style={textStyle}>{'AVAILABLE SOON'}</h2> */}

      <h4 style={{ ...textStyle, marginBottom: '5px' }}>{description}</h4>

    </div>
  );
};

UnderConstructionBox.propTypes = {
  notInConfig: PropTypes.bool
};

export default UnderConstructionBox;
