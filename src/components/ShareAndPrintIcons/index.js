import React, { useState } from 'react';

import shareIcon from './images/share_icon.png';
import printIcon from './images/print_icon.png';
import './style.css';

const ShareAndPrintIcons = () => {
  const [isCopied, setIsCopied] = useState(false);



  return (
    <div className='share-print-icons'>
      {isCopied
        ? <div>Link Copied!</div>
        : null}
      <img src={shareIcon} onClick={() => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1000);
        });
      }} />
      <img src={printIcon} onClick={() => window.print()} />
    </div>
  );
};

export default ShareAndPrintIcons;
