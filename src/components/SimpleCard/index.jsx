import { useState, useRef, useEffect, use } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import SimpleChart from './subComponents/SimpleChart';
import HorizontalBarChart from '../HorizontalBarChart';
import TrendPill from '../TrendPill';
import InfoIcon from '../InfoIcon';

import getNestedValue from '../../utils/getNestedValue';
import formatValue from '../../utils/formatValue';
import formatQuarterDate from '../../utils/formatQuarterDate';
import createCompareDataObject from '../../utils/createCompareDataObject';
import './style.css';

const SimpleCard = ({
  config,
  data,
  viewType,
  project,
  // dashboardType,
  cardKey,
  setSelectedLink,
  getter,
  // trendDataType,
}) => {
  const {
    chart,
    key,
    label,
    units,
    summary,
    cardStyle,
    headerStyle,
    // indicator,
    disablePill,
    getterKey,
    subHeadingManifest
  } = config;
  const [cardFullSize, setCardFullSize] = useState(false);
  const [summaryData, setSummaryData] = useState({
    displayValue: null,
    currentValue: null,
    currentDate: null,
    compareValue: null,
    compareDate: null
  });
  const scrollToRef = useRef();
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const lng = queryParams.get('lng') || null;

  const [allSummaryData, setAllSummaryData] = useState();
  const [projectedData, setProjectedData] = useState();
  const [dataPath, setDataPath] = useState(config?.dataPath);
  const [denominatorData, setDenominatorData] = useState(config?.denominatorPath ? getNestedValue(data, config?.denominatorPath, key) : null);
  const [projectedDataPath, setProjectedDataPath] = useState(config?.projectedDataPath);
  const selectorPath = getter?.[getterKey?.selectorPath];
  const selectedIndicator = getter?.[getterKey?.selectedIndicator];
  const [derivedDate, setDerivedDate] = useState(null);
  const [derivedMaxValue, setDerivedMaxValue] = useState(null);

  // console.log({ config });

  useEffect(() => {
    // console.log('Data', {data, dataPath, projectedDataPath, key});

    if (data) {
      const nestedData = getNestedValue(data, dataPath, key);


      if (chart?.valueType === 'mostCurrent') {
        let mostCurrentKey = null;
        Object.values(nestedData || {}).forEach((item) => {
          Object.keys(item).forEach((dateKey) => {
            dateKey > mostCurrentKey ? mostCurrentKey = dateKey : null;
          })
        })
        // console.log('Most Current Key', mostCurrentKey);
        setDerivedDate(mostCurrentKey);
        const mostCurrentData = {};
        let maxValue = 0;
        Object.entries(nestedData || {}).forEach(([dataKey, dataValue]) => {
          if (chart?.exclude && chart?.exclude.includes(dataKey)) {
            return;
          }
          mostCurrentData[dataKey] = dataValue[mostCurrentKey];
          if (dataValue[mostCurrentKey] > maxValue) {
            maxValue = dataValue[mostCurrentKey];
          }
        });
        // console.log('Max Value', maxValue);
        setDerivedMaxValue(maxValue);
        // console.log('Most Current Data', mostCurrentData);
        setAllSummaryData(mostCurrentData);

      } else {
        if (summary?.postCalculator === 'QuarterToDailyAverage') {
          const adjustedData = {};
          Object.entries(nestedData || {}).forEach(([dataKey, dataValue]) => {
            adjustedData[dataKey] = dataValue / 90;
          });
          // console.log('Adjusted Data', adjustedData);
          setAllSummaryData(adjustedData);
        } else {
          setAllSummaryData(nestedData);
        }
        //
        // setAllSummaryData(getNestedValue(data, dataPath, key));
        if (projectedDataPath) {
          setProjectedData(getNestedValue(data, projectedDataPath, key));
        }

        if (denominatorData) {
          const adjustedData = {};
          Object.entries(nestedData || {}).forEach(([dataKey, dataValue]) => {
            if (denominatorData[dataKey]) {
              adjustedData[dataKey] = 100 * (dataValue * (summary?.calculator === 'x1000' ? 1000 : 1)) / denominatorData[dataKey];
            } else {
              adjustedData[dataKey] = null;
            }
          });
          setAllSummaryData(adjustedData);
        }


        if (chart?.type === 'horizontal-bar') {
          let maxValue = 0;
          Object.entries(nestedData || {}).forEach(([dataKey, dataValue]) => {
            if (chart?.exclude && chart?.exclude?.includes(dataKey)) {
              return;
            }
            if (dataValue > maxValue) {
              maxValue = dataValue;
            }
          });

          setDerivedMaxValue(maxValue);
        }
      }



    }

  }, [
    data,
    dataPath,
    projectedDataPath
  ]);


  useEffect(() => {

    if (
      getter?.[getterKey?.selectorPath] ||
      getter?.[getterKey?.selectedIndicator]
    ) {
      let newDataPathArray = [];
      const currentPath = summary?.dataPath || config?.dataPath;
      const currentPathArray = currentPath.split('.');
      // const currentPathArrayLength = currentPathArray.length;

      const selectorDataPath = selectorPath?.dataPath

      const spliceIndex = currentPathArray.length - (config?.splicePosition || 2);

      if (selectorDataPath) {
        if (config?.dataPathBase) {
          const dataPathBaseArray = config?.dataPathBase.split('.');
          dataPathBaseArray.forEach((path) => {
            newDataPathArray.push(path);
          });
        }
        const selectorDataPathArray = selectorDataPath.split('.');
        selectorDataPathArray.forEach((path, index) => {
          newDataPathArray.push(path);
        });
        if (selectedIndicator) {
          newDataPathArray.push(selectedIndicator?.value || selectedIndicator);
        } else {
          newDataPathArray.push(currentPathArray[currentPathArray.length - 1]);
        }
      } else {
        currentPathArray.forEach((path, index) => {
          if (
            selectorPath &&
            index === spliceIndex
          ) {
            newDataPathArray.push(selectorPath?.value || selectorPath);
          } else if (
            selectedIndicator &&
            index === currentPathArray.length - 1
          ) {
            newDataPathArray.push(selectedIndicator?.value || selectedIndicator);
          } else {
            newDataPathArray.push(path);
          }

        }
        );
      }



      if (newDataPathArray.length) {

        setDataPath(newDataPathArray.join('.'));
      }
    }

    if (
      getter?.[getterKey?.selectorPath] ||
      getter?.[getterKey?.selectedIndicator] ||
      config?.projectedDataPath
    ) {
      let newDataPathArray = [];
      const currentPath = config?.projectedDataPath // summary?.dataPath || config?.dataPath;
      const currentPathArray = currentPath?.split('.') || [];
      // const currentPathArrayLength = currentPathArray.length;

      const selectorDataPath = selectorPath?.dataPath

      const spliceIndex = currentPathArray.length - (config?.splicePosition || 2);
      if (selectorDataPath) {
        const selectorDataPathArray = selectorDataPath.split('.');
        selectorDataPathArray.forEach((path, index) => {
          newDataPathArray.push(path);
        });
        if (selectedIndicator) {
          newDataPathArray.push(selectedIndicator?.value || selectedIndicator);
        } else {
          newDataPathArray.push(currentPathArray[currentPathArray.length - 1]);
        }
      } else {
        currentPathArray.forEach((path, index) => {
          if (
            selectorPath &&
            index === spliceIndex
          ) {
            newDataPathArray.push(selectorPath?.value || selectorPath);
          } else if (
            selectedIndicator &&
            index === currentPathArray.length - 1
          ) {
            newDataPathArray.push(selectedIndicator?.value || selectedIndicator);
          } else {
            newDataPathArray.push(path);
          }

        }
        );
      }



      if (newDataPathArray.length) {

        setProjectedDataPath(newDataPathArray.join('.'));
      }
    }

  },
    [
      getter?.[getterKey?.selectorPath],
      getter?.[getterKey?.selectedIndicator]
    ]);

  getNestedValue(data, summary?.dataPath || dataPath, key);
  // Handles issue with there being newbusiness data but the actual section on the dashboard is smallbusiness
  const sectionKey = cardKey === 'newbusiness' ? 'smallbusiness' : cardKey;
  const route = config?.route || `/${project}/${sectionKey}`;

  // const getterKey = config?.getterKey || {};
  let trendDataType = getter?.[getterKey?.trendDataType] || null;
  if (config?.dateType === 'year') {
    if (trendDataType === 'QtQ') {
      trendDataType = 'YtY';
    } else if (trendDataType === 'YtY') {
      trendDataType = 'QtQ';
    } else {
      trendDataType = 'YtY';
    }
  }


  const subHeadingText = `${(selectorPath && selectedIndicator) || selectedIndicator
      ? `${selectedIndicator?.label || selectedIndicator}, ${selectorPath?.label || selectorPath || config?.indicator?.Geography}`
      : selectorPath &&
        !selectedIndicator &&
        config?.indicator?.Geography &&
        `${config?.indicator?.Geography}`?.toLowerCase() !== `${selectorPath}`?.toLowerCase() &&
        `${config?.indicator?.Geography}`?.toLowerCase() !== selectorPath?.label?.toLowerCase()
        ? selectorPath?.label?.toLowerCase() !== 'total' &&
          `${selectorPath}`?.toLowerCase() !== 'total'
          ? `${selectorPath?.label || selectorPath}`
          : config?.defaultSubheading || config?.indicator?.Geography
        : selectorPath && !selectedIndicator
          ? `${selectorPath?.label || selectorPath}`
          : config?.defaultSubheading || config?.indicator?.Geography
    }${derivedDate ? `, ${derivedDate}` : ''}`;
  // console.log({ trendDataType });

  useEffect(() => {
    if (data && allSummaryData) {
      // console.log('allSummaryData', allSummaryData);
      setSummaryData(
        createCompareDataObject(
          summary?.calculator,
          allSummaryData,
          trendDataType,
          summary?.filter
        )
      );
    }
  }, [allSummaryData, trendDataType]);

  return (
    <div
      key={`${dataPath?.replace(/\./g, '-')}-simple-card`}
      ref={scrollToRef}
      className='simple-card'
      style={cardStyle || {}}
    >
      <div className='simple-card-header' role='heading'>
        <div
          className='simple-card-title'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '5px'
          }}
        >
          {viewType === 'mobile' ? (
            <Icon
              name={`angle ${cardFullSize ? 'down' : 'up'}`}
              link
              onClick={() => {
                setCardFullSize(!cardFullSize);
                scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ) : null}
          <h4 className='simple-card-header-text' style={{ ...headerStyle || {} }}>{label?.toUpperCase() || 'UNDEFINED'}</h4>
          <div>
            <InfoIcon config={config?.indicator} popup />
          </div>
        </div>

        {viewType === 'mobile' && !cardFullSize && !disablePill ? (
          <TrendPill
            positiveTrendDirection={summary?.positiveTrendDirection}
            currentValue={summaryData.currentValue}
            compareValue={summaryData.compareValue}
            compareDate={summaryData.compareDate}
            units={config.summary.trendUnits}
            data={allSummaryData}
            trendDataType={trendDataType}
            displayCompareText={viewType !== 'mobile'}
            onlyYears={config?.dateType === 'year'}

          />
        ) : null}
      </div>

      <h5 className='simple-card-sub-header'>
        {`${subHeadingManifest?.[subHeadingText] || subHeadingText}`?.toLocaleUpperCase()}

      </h5>
      {(viewType !== 'mobile' || cardFullSize) && chart.type !== 'horizontal-bar' ? (
        <>
          <div
            className='simple-data-wrapper'
            // style={{
            //   flexDirection: 'row-reverse'
            // }}
            onClick={() => {
              // if (label !== 'Venture Capital Investment') {
              setSelectedLink(sectionKey);
              navigate(route);
              // }
            }}
          >

            <div className='simple-chart'>
              {chart?.type && allSummaryData ? (
                <SimpleChart
                  lng={lng}
                  key={`${dataPath}-${cardKey}-simple-chart`}
                  config={chart}
                  viewType={viewType}
                  projectedData={projectedData}
                  data={
                    chart.type !== 'donut'
                      ? allSummaryData
                      : { key: summaryData.currentDate, value: summaryData.displayValue }
                  }
                />
              ) : null}
            </div>
            <div className='simple-data bold-font'>
              <h2 className='bold-font'>
                {summaryData.displayValue
                  ? formatValue(summaryData.displayValue, config?.summary?.trendUnits)
                  : '-'}
              </h2>
              {units ? <h5 className='simple-units'>{units}</h5> : null}
              {summaryData?.currentDate ? <h5 className='simple-indicator-date'>{formatQuarterDate(summaryData.currentDate, 'QX YYYY', lng)}</h5> : null}
              {/* {summaryData?.currentDate ? <h5 className='simple-indicator-date'>{summaryData.currentDate}</h5> : null } */}

            </div>

          </div>
          {!disablePill && (viewType !== 'mobile' || cardFullSize) ? (
            <TrendPill
              lng={lng}
              positiveTrendDirection={summary?.positiveTrendDirection}
              currentValue={summaryData.currentValue}
              compareValue={summaryData.compareValue}
              compareDate={summaryData.compareDate}
              units={config?.summary?.trendUnits}
              data={allSummaryData}
              trendDataType={trendDataType}
              displayCompareText
              onlyYears={config?.dateType === 'year'}
            />
          ) : null}
        </>
      ) : null}
      {
        chart.type === 'horizontal-bar' ? (
          // <p>{JSON.stringify(allSummaryData)}</p>
          // <HorizontalBarChart
          //   lng={lng}
          //   config={chart}
          //   data={allSummaryData}
          //   height={150}
          //   width={'100%'}
          //   margin={{ top: 10, right: 10, bottom: 20, left: 40 }}
          //   hasTooltip
          // />
          <div style={{
            height: '100%',
            maxHeight: '280px',
            marginTop: '20px',
            width: '100%',
            overflowY: 'auto',
          }}>
            {Object.entries(allSummaryData || {})
              .filter(([barKey, barValue]) => {
                if (chart?.exclude && chart?.exclude.includes(barKey)) {
                  return false;
                }
                if (barValue === null || barValue === undefined) {
                  return false;
                }
                return true;
              })
              .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
              .map(([barKey, barValue]) => (
                <div
                  key={`${dataPath}-horizontal-bar-${barKey}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ width: '40%', height: '20px', lineHeight: '20px' }}>
                    <h5 style={{ height: '20px', lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '10px' }} className='horizontal-bar-label'>{barKey}</h5>
                  </div>
                  <div style={{
                    width: 'calc(60% - 60px)',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap'
                  }}>
                    {/* <div style={{width: '80%', backgroundColor: '#e0e0e0', height: '10px', borderRadius: '5px'}}> */}
                    <div
                      style={{
                        width: `${barValue / derivedMaxValue * 100}%`,
                        minWidth: `${barValue / derivedMaxValue * 100}%`,
                        backgroundColor: chart.color || 'var(--primary-color)',
                        height: '20px',
                        textAlign: 'right',
                        // borderRadius: '5px'
                      }}
                    >

                    </div>
                    <div
                      className='horizontal-bar-value'
                      style={{ marginLeft: '5px' }}
                    >{formatValue(barValue, chart.values?.formatter || null)}</div>

                    {/* </div> */}
                  </div>
                </div>
              ))}
          </div>

        ) : null
      }
      <br />
      {/* <h5>{dataPath}</h5> */}

    </div>
  );
};

SimpleCard.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  cardKey: PropTypes.string,
  viewType: PropTypes.string,
  setSelectedLink: PropTypes.func,
  trendDataType: PropTypes.string
};

export default SimpleCard;
