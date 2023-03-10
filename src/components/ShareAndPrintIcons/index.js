import React from 'react';

import shareIcon from './images/share_icon.png';
import printIcon from './images/print_icon.png';
import './style.css';

const ShareAndPrintIcons = () => {
  return (
    <div className='share-print-icons'>
      <img src={shareIcon} onClick={() => console.log('share!')} />
      <img src={printIcon} onClick={() => console.log('print!')} />
    </div>
  );
};

export default ShareAndPrintIcons;
