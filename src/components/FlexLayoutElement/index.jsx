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
import SimpleLineChart from '../SimpleLineChart.js';
import SimpleCard from '../SimpleCard/index.jsx';
import InfoCard from '../InfoCard/index.jsx';
import HTML from '../HTML/index.jsx';
import FilterDropdown from '../FilterDropdown/index.jsx';

import { handleElementStyle, sanitizeHTML } from './utils';
import SelectedImage from '../SelectedImage';
import getNestedValue from '../../utils/getNestedValue.js';

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
  keepColumnsOnTablet,
  // lastElement,
  // lastRecursiveElement,
  view,
  scrollRef,
  recursive,
  firstRecursive,
  manifest
}) => {
  const {
    columns,
    rows,
    content,
    height,
    width,
    style,
  
  } = layout;


  const mobile = viewType === 'mobile';
  const tablet = viewType === 'tablet';
  const elementRef = useRef();
  const type = columns ? 'columns' : rows ? 'rows' : content ? 'content' : '';
  const elementArray = columns || rows;

  // console.log(elementArray)

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
          element.scrollIntoView({behavior: 'smooth'});
        }
      }    
    }
  }, [viewLoaded]);

  return (
    <div
      ref={elementRef}
      id={scrollRef}
      className={`flex-layout-${(mobile || (tablet && !keepColumnsOnTablet)) && type !== 'content' ? 'rows' : type}`}
      style={handleElementStyle(
        style,
        height,
        width,
        viewType,
        !recursive,
        firstRecursive,
        columns ? true : false,
         // First Round Style
      )}
    >
      {!content ? (
        elementArray?.map((element, i) => (
          <FlexLayoutElement
            key={`recursive-flex-layout-el-${i}-${view?.key}`}
            recursive
            firstRecursive={!recursive}
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
            keepColumnsOnTablet={element?.keepColumnsOnTablet}
            viewLoaded={viewLoaded}
            manifest={manifest}
          />
        )) || <div/>
      ) : content?.type === 'simple-card' ? (
        <SimpleCard
          config={content?.config || content}
          data={data}
          getter={getter}
          // project={project}
          // dashboardType={null}
          // cardKey={card.key}
          // viewType={viewType}
          // setSelectedLink={setSelectedLink}
        /> 
       
      ) : content?.type === 'selector-map' ? (
        <SelectorMap 
          project={project} 
          config={content?.config || content} 
          setter={setter} 
          data={data}
          getter={getter}
          />
      ) : content?.type === 'trend-data-toggler' ? (
        <TrendDataToggle
          config={content?.config || content}
          getter={getter}
          setter={setter}
        />
      ) : (content?.type === 'title-with-trend-data-toggler' || content?.type === 'title') && content?.config ? (
        <SectionTitle
          config={content?.config || content}
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
          config={content?.config || content}
          getter={getter}
          setter={setter}
          viewType={viewType}
          viewLoaded={viewLoaded}
        />
      ) : content?.type === 'simple-indicator-box' ? (
        <SimpleIndicatorBox data={data} config={content?.config || content} getter={getter} />
      ) : content?.type === 'compare-selector' ? (
        <CompareDropdownSelection
          data={data}
          enableSearch={content?.config?.searchable}
          config={content?.config || content}
          options={content.config?.options}
          indicatorWithDataPath={getter?.[content?.config?.getterKey?.indicatorWithDataPath]}
          dataToggle={getter?.[content?.config?.getterKey?.optionsToggle] || content?.config?.defaultDataToggle}
          selectedOption={getter?.[content?.config?.getterKey?.selectedOption] ||  content?.config?.defaultSelected}
          optionsResetTrigger={getter?.[content?.config?.getterKey?.optionsResetTrigger]}
          setter={setter}
        />
      ) : content?.type === 'multi-line-chart' ? (
        <MultiLineChart
          data={data || null}
          config={content?.config || content}
          getter={getter}
          setter={setter}
          viewType={viewType}
        />
      ) : content?.type === 'compare-column-chart' ? (
        <CompareColumnChart
          data={data || null}
          config={content?.config || content}
          getter={getter}
          setter={setter}
        />
      ) : content?.type === 'simple-column-chart' ? (
        <SimpleColumnChart config={content?.config || content} data={data} getter={getter} />
      ) : content?.type === 'selector-with-legend' ? (
        <SelectorWithLegend
          setter={setter}
          getter={getter}
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
      ) : content?.type === 'filter-dropdown' ? (
        <FilterDropdown
          setter={setter}
          getter={getter}
          config={content}
          options={content.options}
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
      ) : content?.type === 'simple-line-chart' ? (
        <SimpleLineChart
          config={content?.config || content}
          data={data}
          getter={getter}
          // height={height}
          // width={width}
          // margin={content.config?.margin}
        />
      ) : content?.type === 'under-construction' ? (
        <UnderConstructionBox 
          style={style}
          description={content?.description}/>
      ) : content?.type === 'about-the-data' ? (
        <AboutProject
          config={content?.config || content}
          project={project}
          viewType={viewType}
          infoIconConfig={infoIconConfig}
        />
      ) : content?.type === 'horizontal-bar-chart' ? (
        <HorizontalBarChart
          config={content?.config || content}
          data={data}
          setter={setter}
          getter={getter}
          manifest={manifest}
        />
      ) : content?.type === 'selected-image' ? (
        <SelectedImage
          config={content?.config || content}
          getter={getter}
          project={project}
          viewType={viewType}
        />
      ) : content?.type === 'indicator-map' ? (
        <IndicatorMap
          config={content?.config || content}
          project={project}
          getter={getter}
          viewLoaded={viewLoaded}
        // getterKey={content.getterKey}
        />
      ) : content?.type === 'info-card' ? (
        <InfoCard
          data={getNestedValue(data, content?.dataPath)}
          config={content?.config || content}
          stats={getNestedValue(data, content?.statsPath)}
          />
      ) : (content?.type === 'filler' || content.type === 'html') ? (
        <div 
          style={{
            ...content?.style ||{}
          }}>
            {content?.text || null}            
            {
              content?.html
                // ? sanitizeHTML(content.htmlString)
                ? <HTML data={content.html} />
                : null
            }
          </div>
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
  scrollRef: PropTypes.string,
  recursive: PropTypes.bool,
  firstRecursive: PropTypes.bool,
  keepColumnsOnTablet: PropTypes.bool

};

export default FlexLayoutElement;
