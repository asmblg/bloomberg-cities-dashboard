import React, { 
  useEffect,
  useState, 
  useRef, 
  use
} from 'react';
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
  tabStyle,
  manifest,
  variables,
  // refreshOnLoad
}) => {
  const layoutRef = useRef();
  const [getter, setter] = useState(initialState || {});
  const [elementArray, setElementArray] = useState(null);
  const [view, setView] = useState(viewOptions?.[0]); // object
  const [isColumns, setIsColumns] = useState(null);
  const [viewLoaded, setViewLoaded] = useState(false);

  let hashValue = window.location.hash 
    ? window.location.hash.substring(1) 
    : null;

  const invalidHash = [
    'style',
    "dataPath",
    "diableShareIcon",
    "disableInfoIcon",
    "disableViewSelector",
    "disableTrendDataToggle",
    "disableSourceLink",
    "disableHeader",
    "noTabs",
    "breakpoints",
    "tabStyle",
    "views",
    "layout",
    "sources",
    "title",
    "description",
    "infoIconConfig",
    "trendDataToggleConfig",
    "shareAndPrintIconsConfig"
  ];

  if (invalidHash.includes(hashValue)) {
    hashValue = null;
  }

    const { style } = layout?.[hashValue] || layout || {};

  // console.log('HASH VALUE', hashValue);
  // const getter = useMemo(() => {
  //   // Perform any transformation or computation with `getter` if necessary
  //   // For instance, you might want to derive some values from it
  //   return nonMemoGetter; // Return the getter or a transformed version of it
  // }, [nonMemoGetter]);

  const handleElementArray = async () => new Promise((resolve) => {
    if (!views) {
      const { columns, rows } = layout?.[hashValue] || layout || {};
      if (columns) {
        setIsColumns(true);
      }
      resolve(columns || rows);
    } else if (views[view?.key]) {
      // console.log(views[view]);
      const { columns, rows } = views[view.key].layout;
      if (columns) {
        setIsColumns(true);
      }
      resolve(columns || rows);
    }
    // resolve();
  });

  const handleSetter = (setterKey, value) => {
    // console.log('HANDLE SETTER', setterKey);
    const multipleSetters = Array.isArray(setterKey);
    const setterObj = { ...getter };

    if (multipleSetters) {

      setterKey.forEach((key, i) => {
        if (key) {
          setterObj[key] = value[i];
        }
      });
    } else {
      setterObj[setterKey] = value;
    }
    // console.log(setterObj);
    setter(setterObj);

  };

  useEffect(() => {
    setViewLoaded(false);
    setElementArray([])
    setter(initialState || {});
    handleElementArray().then((array) => {
      // console.log('ELEMENT ARRAY', array);
      setElementArray(array);

      setViewLoaded(true);
    });
  }, [hashValue, layout, views, view]);

  // console.log('Elemnent Array', elementArray);


  
  return (
    <div
      ref={layoutRef}
      key={`layout-${project}-${views?.[view?.key] || 'single-view'}-${hashValue || 'default'}`}
      style={{ display: 'flex', flexDirection: 'column' , ...style}}>
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
        {elementArray
        ?.map((element, i) => (
          <FlexLayoutElement
            key={`flex-layout-el-${i}-${view?.key}`}
            view={view}
            data={data}
            deactivated={element.deactivated}
            project={project}
            layout={element}
            setter={handleSetter}
            getter={getter}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            viewType={viewType}
            infoIconConfig={infoIconConfig}
            setInfoIconConfig={setInfoIconConfig}
            lastElement={elementArray.length - 1 === i }
            scrollRef={element?.scrollRef}
            keepColumnsOnTablet={element?.keepColumnsOnTablet}
            manifest={manifest}
            variables={variables}
            // setViewLoaded={setViewLoaded}
            viewLoaded={viewLoaded}
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
  tabStyle: PropTypes.object,
  // refreshOnLoad: PropTypes.bool
};

export default FlexLayout;
