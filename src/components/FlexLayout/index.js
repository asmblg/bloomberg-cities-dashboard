import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import FlexLayoutElement from '../FlexLayoutElement';
import ViewSwitcher from '../ViewSwitcher';

import { handleStyle } from './utils';
import './style.css';

const FlexLayout = ({
  initialState,
  layout,
  views,
  viewOptions,
  data,
  project,
  viewType,
  selectedLink,
  setSelectedLink,
  infoIconConfig,
  setInfoIconConfig,
  tabStyle
}) => {
  const [getter, setter] = useState(initialState || {});
  const [elementArray, setElementArray] = useState(null);
  const [view, setView] = useState(viewOptions?.[0]); // object
  const [isColumns, setIsColumns] = useState(null);

  const handleElementArray = () => {
    if (!views) {
      const { columns, rows } = layout;
      if (columns) {
        setIsColumns(true);
      }
      setElementArray(columns || rows);
    } else if (views[view?.key]) {
      // console.log(views[view]);
      const { columns, rows } = views[view.key].layout;
      if (columns) {
        setIsColumns(true);
      }
      setElementArray(columns || rows);
      setter(initialState || {});
    }
  };

  const handleSetter = (setterKey, value) => {
    const multipleSetters = Array.isArray(setterKey);
    if (multipleSetters) {
      const setterObj = { ...getter };
      setterKey.forEach((key, i) => {
        if (key) {
          setterObj[key] = value[i];
        }
      });
      setter(setterObj);
    } else {
      setter({
        ...getter,
        [setterKey]: value
      });
    }
  };

  useEffect(() => (handleElementArray()), [layout, views, view]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {view && views?.[view.key] && (
        <ViewSwitcher
          key={`view-switcher-${view.key}`}
          project={project}
          setView={setView}
          viewObject={view}
          viewOptions={viewOptions}
          tabStyle={tabStyle}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          infoIconConfig={infoIconConfig}
          setInfoIconConfig={setInfoIconConfig}
          viewType={viewType}
        />
      )}
      <div className='flex-layout' style={handleStyle(isColumns, viewType)}>
        {elementArray?.map((element, i) => (
          <FlexLayoutElement
            key={`flex-layout-el-${i}`}
            data={data}
            project={project}
            layout={element}
            setter={handleSetter}
            getter={getter}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            viewType={viewType}
            infoIconConfig={infoIconConfig}
            setInfoIconConfig={setInfoIconConfig}
          />
        ))}
      </div>
    </div>
  );
};

FlexLayout.propTypes = {
  layout: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  initialState: PropTypes.object,
  viewType: PropTypes.string,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func,
  infoIconConfig: PropTypes.object,
  setInfoIconConfig: PropTypes.func,
  views: PropTypes.object,
  viewOptions: PropTypes.array,
  tabStyle: PropTypes.object
};

export default FlexLayout;
