import React from 'react';

const UnderConstructionBox = () => {
  const textStyle = {
    fontFamily: 'RobotoBlack',
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
        height: '100%',
        backgroundColor: '#F5F7F8'
      }}
    >
      <h4 style={{ ...textStyle, marginBottom: '20px' }}>{'CURRENTLY UNDER DEVELOPMENT'}</h4>
      <h4 style={textStyle}>{'AVAILABLE SOON'}</h4>
    </div>
  );
};

export default UnderConstructionBox;
