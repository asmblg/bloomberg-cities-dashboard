import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';

import './style.css';

const ShareAndPrintIcons = () => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className='share-print-icons'>
      {isCopied ? <div style={{ marginRight: '10px' }}>Link Copied!</div> : null}
      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
          });
        }}
        style={{
          marginRight: '10px'
        }}
      >
        <Icon className='sap-icon' name='share alternate' circular />
      </div>
      <div onClick={() => window.print()}>
        <Icon className='sap-icon' name='file pdf' circular />
      </div>
    </div>
  );
};

export default ShareAndPrintIcons;
