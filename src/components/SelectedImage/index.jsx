import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { getImage } from './utils';
import './style.css';

const SelectedImage = ({ config, getter, project, viewType }) => {
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(viewType !== 'mobile');
  const [showImageToggle, setShowImageToggle] = useState(viewType === 'mobile');

  // caches getterKey on render and dependency changes
  const selectedImageKey = useMemo(
    () =>
      getter && config?.getterKey?.selectedImage
        ? getter[config.getterKey.selectedImage]?.key
        : null,
    [getter, config]
  );

  useEffect(() => {
    if (project && selectedImageKey) {
      const category = config.getterKey.selectedImage;
      getImage(project, category, selectedImageKey).then(img => {
        if (img) {
          setImage(img);
        } else if (viewType === 'mobile') {
          setShowImageToggle(false); // no image to show, hide image toggle
        }
      });
    }
  }, [project, config, selectedImageKey]);

  // console.log({ image });

  return (
    <div
      key={`img-container-${project}-${selectedImageKey}`}
      className='selected-img-container'
      style={viewType === 'tablet' ? { height: '20px', flexGrow: 1 } : {}}
    >
      {viewType === 'mobile' && showImageToggle && (
        <h5 className='display-img-text' onClick={() => setShowImage(!showImage)}>
          {showImage ? 'Hide Image' : 'Show Image'}
        </h5>
      )}
      {image && typeof image === 'object' && image.default && showImage && (
        <img className='selected-img' src={image.default} alt="Selected" />
      )}
    </div>
  );

  // useEffect(() => {
  //   if (project && selectedImageKey) {
  //     // console.log({ selectedImageKey });
  //     const category = config.getterKey.selectedImage;
  //     getImage(project, category, selectedImageKey).then(img => {;

  //       if (img) {
  //         setImage(img);
  //       } else if (viewType === 'mobile') {
  //         setShowImageToggle(false); // no image to show, hide image toggle
  //       }
  //     });
  //   }
  // }, [project, config, selectedImageKey]);

  // console.log({ image });

  // return (
  //   <div
  //     key={`img-container-${project}-${selectedImageKey}`}
  //     className='selected-img-container'
  //     style={viewType === 'tablet' ? { height: '20px' } : {}}
  //   >
  //     {viewType === 'mobile' && showImageToggle && (
  //       <h5 className='display-img-text' onClick={() => setShowImage(!showImage)}>
  //         {`${showImage ? 'Hide' : 'Show'} map`}
  //       </h5>
  //     )}

  //     {image && showImage && (
  //       <img
  //         src={image}
  //         alt=""
  //         className='selected-img'
  //         style={viewType === 'tablet' ? { height: '180px', width: 'auto' } : {}}
  //       />
  //     )}
  //   </div>
  // );
};

SelectedImage.propTypes = {
  config: PropTypes.object,
  getter: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string
};

export default SelectedImage;
