import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import SelectorMap from '../SelectorMap';
import TrendDataToggle from '../TrendDataToggle';
import IndicatorTrendBox from '../IndicatorTrendBox';
import SimpleIndicatorBox from '../SimpleIndicatorBox';
import CompareDropdownSelection from '../CompareDropdownSelection';
import MultiLineChart from '../MultiLineChart';
import CompareColumnChart from '../CompareColumnChart';
import SimpleColumnChart from '../SimpleColumnChart';
import SelectorWithLegend from '../SelectorWithLegend';
import IndicatorDropdown from '../IndicatorDropdown';
import ComboLineAreaChart from '../ComboLineAreaChart';
import UnderConstructionBox from '../UnderConstructionBox';
import AboutProject from '../AboutTheData';
import SectionTitle from '../SectionTitle';
import HorizontalBarChart from '../HorizontalBarChart';
import IndicatorMap from '../IndicatorMap';

import { handleElementStyle } from './utils';
import SelectedImage from '../SelectedImage';

const FlexLayoutElement = ({
  data,
  setter,
  getter,
  layout,
  project,
  selectedLink,
  setSelectedLink,
  viewType,
  infoIconConfig,
  setInfoIconConfig,
  // setViewLoaded,
  viewLoaded,
  // lastElement,
  // lastRecursiveElement,
  view,
  scrollRef
}) => {
  const {
    columns,
    rows,
    content,
    height,
    width,
    style
    // mobileStyle,
    // tabletStyle
  } = layout;

  const mobile = viewType === 'mobile';
  const elementRef = useRef();
  const type = columns ? 'columns' : rows ? 'rows' : content ? 'content' : '';
  const elementArray = columns || rows;

  // useEffect(() => {
  //   if (viewLoaded && !lastElement) {
  //     setViewLoaded(false);
  //   }
  //   if (lastElement) {
  //     setViewLoaded(true);
  //     // setViewLoaded(true);
  //   }
  // }, [layout]);

  useEffect(() => {
    if (viewLoaded) {
      const hash = window.location.hash;
      if (hash) {
        // Remove the '#' from the hash.
        const id = hash.replace('#', '');

        // Find the element with the corresponding ID.
        const element = document.getElementById(id);
        
        // Scroll to the element if it exists.
        if (element) {
          element.scrollIntoView();
        }
      }    
    }
  }, [viewLoaded]);

  return (
    <div
      ref={elementRef}
      id={scrollRef}
      className={`flex-layout-${mobile && type !== 'content' ? 'rows' : type}`}
      style={handleElementStyle(
        style,
        // mobileStyle,
        height,
        width,
        viewType
        // tabletStyle
      )}
    >
      {!content && data ? (
        elementArray.map((element, i) => (
          <FlexLayoutElement
            key={`recursive-flex-layout-el-${i}-${view?.key}`}
            scrollRef={element?.scrollRef}
            data={data}
            setter={setter}
            getter={getter}
            layout={element}
            project={project}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            infoIconConfig={infoIconConfig}
            setInfoIconConfig={setInfoIconConfig}
            viewType={viewType}
            lastElement={elementArray.length - 1 === i}
            // setViewLoaded={setViewLoaded}
            viewLoaded={viewLoaded}
            // lastRecursiveElement={lastElement && elementArray.length - 1 === i}
          />
        ))
      ) : content?.type === 'selector-map' ? (
        <SelectorMap project={project} config={content.config} setter={setter} />
      ) : content?.type === 'trend-data-toggler' ? (
        <TrendDataToggle
          config={content.config}
          getter={getter}
          setter={setter}
        // viewLoaded
        />
      ) : (content?.type === 'title-with-trend-data-toggler' || content?.type === 'title') && content?.config ? (
        <SectionTitle
          config={content.config}
          setInfoIconConfig={setInfoIconConfig}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          project={project}
          getter={getter}
          setter={setter}
          toggler={content?.type === 'title-with-trend-data-toggler'}
        />
      ) : content?.type === 'indicator-trend-box' ? (
        <IndicatorTrendBox
          data={data}
          config={content.config}
          getter={getter}
          setter={setter}
          viewType={viewType}
          viewLoaded={viewLoaded}
        />
      ) : content?.type === 'simple-indicator-box' ? (
        <SimpleIndicatorBox data={data} config={content.config} getter={getter} />
      ) : content?.type === 'compare-selector' ? (
        <CompareDropdownSelection
          data={data}
          // title={content?.config?.title}
          // titles={content?.configs?.titles}
          enableSearch={content?.config?.searchable}
          config={content.config}
          options={content.config?.options}
          indicatorWithDataPath={getter?.[content?.config?.getterKey?.indicatorWithDataPath]}
          dataToggle={getter?.[content?.config?.getterKey?.optionsToggle] || content?.config?.defaultDataToggle}
          selectedOption={getter?.[content?.config?.getterKey?.selectedOption] ||  content?.config?.defaultSelected}
          optionsResetTrigger={getter?.[content?.config?.getterKey?.optionsResetTrigger]}
          // getter={getter}
          setter={setter}
          // onUpdate={({selection}) => 
          //   setter(content?.config?.setterKey?.selectionKey, selection)
          // }
        />
      ) : content?.type === 'multi-line-chart' ? (
        <MultiLineChart
          data={data || null}
          config={content.config}
          getter={getter}
          setter={setter}
          viewType={viewType}
        />
      ) : content?.type === 'compare-column-chart' ? (
        <CompareColumnChart
          data={data || null}
          config={content.config}
          getter={getter}
          setter={setter}
        />
      ) : content?.type === 'simple-column-chart' ? (
        <SimpleColumnChart config={content.config} data={data} getter={getter} />
      ) : content?.type === 'selector-with-legend' ? (
        <SelectorWithLegend
          // options={content.options}
          // colors={content.colors}
          setter={setter}
          getter={getter}
          // setterKey={content.setterKey}
          config={content}
          data={data}
        />
      ) : content?.type === 'indicator-dropdown' ? (
        <IndicatorDropdown
          setter={setter}
          getter={getter}
          config={content}
          options={!content.fixedIndicator ? content.indicators : null}
          selectedOption={getter?.[content?.getterKey?.selectedOption] || content?.config?.fixedSelection}
          viewLoaded={viewLoaded}
        />
      ) : content?.type === 'combo-line-area-chart' ? (
        <ComboLineAreaChart
          setter={setter}
          getter={getter}
          config={content}
          data={data}
          viewType={viewType}
        />
      ) : content?.type === 'under-construction' ? (
        <UnderConstructionBox />
      ) : content?.type === 'about-the-data' ? (
        <AboutProject
          config={content.config}
          project={project}
          viewType={viewType}
          infoIconConfig={infoIconConfig}
        />
      ) : content?.type === 'horizontal-bar-chart' ? (
        <HorizontalBarChart
          config={content.config}
          data={data}
          setter={setter}
          getter={getter}
        />
      ) : content?.type === 'selected-image' ? (
        <SelectedImage
          config={content.config}
          getter={getter}
          project={project}
          viewType={viewType}
        />
      ) : content?.type === 'indicator-map' ? (
        <IndicatorMap
          config={content.config}
          project={project}
          getter={getter}
          viewLoaded={viewLoaded}
        // getterKey={content.getterKey}
        />
      ) : content?.type === 'filler' ? (
        <div>{content?.text || null}</div>
      )
        : (
          <UnderConstructionBox notInConfig />
        )}
    </div>
  );
};

FlexLayoutElement.propTypes = {
  data: PropTypes.object,
  setter: PropTypes.func,
  getter: PropTypes.object,
  layout: PropTypes.object,
  project: PropTypes.string,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func,
  viewType: PropTypes.string,
  infoIconConfig: PropTypes.object,
  setInfoIconConfig: PropTypes.func,
  setViewLoaded: PropTypes.func,
  viewLoaded: PropTypes.bool,
  lastElement: PropTypes.bool,
  // lastRecursiveElement: PropTypes.bool,
  view: PropTypes.object,
  scrollRef: PropTypes.string

};

export default FlexLayoutElement;
