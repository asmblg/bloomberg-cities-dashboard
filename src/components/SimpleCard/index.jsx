import { useState, useRef, useEffect, use } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import SimpleChart from './subComponents/SimpleChart';
// import HorizontalBarChart from '../HorizontalBarChart';
import TrendPill from '../TrendPill';
import InfoIcon from '../InfoIcon';

import getNestedValue from '../../utils/getNestedValue';
import calculateDataSeries from '../../utils/calculateDataSeries';
import formatValue from '../../utils/formatValue';
import formatQuarterDate from '../../utils/formatQuarterDate';
import createCompareDataObject from '../../utils/createCompareDataObject';
import './style.css';

const SimpleCard = ({
  config,
  data,
  viewType,
  project,
  variables,
  // dashboardType,
  cardKey,
  // setSelectedLink,
  getter,
  manifest
  // trendDataType,
}) => {
  const {
    chart,
    chart2,
    key,
    label,
    units,
    summary,
    cardStyle,
    headerStyle,
    // orderArray,
    // manifest,
    // indicator,
    disablePill,
    getterKey,
    subHeadingManifest,
    selectedIndicatorManifestKey

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
  // const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const lng = queryParams.get('lng') || null;
  const devMode = queryParams.get('dev') === 'true';

  const [allSummaryData, setAllSummaryData] = useState();
  const [projectedData, setProjectedData] = useState();
  const [dataPath, setDataPath] = useState(config?.dataPath);
  const [denominatorData, setDenominatorData] = useState(config?.denominatorPath ? getNestedValue(data, config.denominatorPath, key) : null);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonDataTotal, setComparisonDataTotal] = useState(null);
  const [projectedDataPath, setProjectedDataPath] = useState(config?.projectedDataPath);
  const selectorPath = getter?.[getterKey?.selectorPath];
  const selectedIndicator = getter?.[getterKey?.selectedIndicator];
  const selectedIndicatorFilterArray = selectedIndicator?.filterArray
    || selectedIndicator?.indicator?.filterArray
    || null;
  const selectorFilterArray = selectorPath?.filterArray
    || selectorPath?.indicator?.filterArray
    || null;
  const filterArray = selectedIndicatorFilterArray || selectorFilterArray || null;
  const isHorizontalBarWithSelector = chart?.type === 'horizontal-bar' && selectorFilterArray?.length;
  const [derivedDate, setDerivedDate] = useState(null);
  const [derivedMaxValue, setDerivedMaxValue] = useState(null);

  const cloneAggregateValue = (value) => {
    if (Array.isArray(value)) {
      return value.map(item => cloneAggregateValue(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => [entryKey, cloneAggregateValue(entryValue)])
      );
    }

    return value;
  };

  const mergeAggregatedValues = (baseValue, nextValue) => {
    if (baseValue == null) {
      return cloneAggregateValue(nextValue);
    }

    if (nextValue == null) {
      return cloneAggregateValue(baseValue);
    }

    if (
      !Array.isArray(baseValue)
      && !Array.isArray(nextValue)
      && typeof baseValue !== 'object'
      && typeof nextValue !== 'object'
    ) {
      const baseNumber = Number(baseValue);
      const nextNumber = Number(nextValue);

      if (Number.isFinite(baseNumber) && Number.isFinite(nextNumber)) {
        return baseNumber + nextNumber;
      }
    }

    if (
      baseValue
      && nextValue
      && typeof baseValue === 'object'
      && typeof nextValue === 'object'
      && !Array.isArray(baseValue)
      && !Array.isArray(nextValue)
    ) {
      const mergedValue = {};
      const mergedKeys = new Set([
        ...Object.keys(baseValue),
        ...Object.keys(nextValue)
      ]);

      mergedKeys.forEach((mergedKey) => {
        mergedValue[mergedKey] = mergeAggregatedValues(baseValue[mergedKey], nextValue[mergedKey]);
      });

      return mergedValue;
    }

    return cloneAggregateValue(nextValue);
  };

  const sumFilterArrayValues = (nestedValue) => {
    if (!filterArray?.length || !nestedValue || typeof nestedValue !== 'object' || Array.isArray(nestedValue)) {
      return nestedValue;
    }

    let hasMatch = false;

    const aggregatedValue = filterArray.reduce((accumulator, filterKey) => {
      const filterValue = nestedValue?.[filterKey] ?? nestedValue?.[`${Number(filterKey)}`];

      if (filterValue == null) {
        return accumulator;
      }

      hasMatch = true;
      return mergeAggregatedValues(accumulator, filterValue);
    }, null);

    return hasMatch ? aggregatedValue : null;
  };

  const getGetterNestedValue = (sourceData, currentPath) => {
    const nestedValue = getNestedValue(sourceData, currentPath, key);

    if (isHorizontalBarWithSelector) {
      return nestedValue;
    }

    const aggregatedValue = sumFilterArrayValues(nestedValue);

    // After aggregating by filterArray, if we have a selectedIndicator and the result is an object,
    // extract the selected district value from the aggregated result
    if (
      selectorFilterArray?.length
      && selectedIndicator
      && aggregatedValue
      && typeof aggregatedValue === 'object'
      && !Array.isArray(aggregatedValue)
    ) {
      const selectedIndicatorPath = selectedIndicator?.dataPath || selectedIndicator?.value || selectedIndicator;
      return aggregatedValue?.[selectedIndicatorPath] ?? aggregatedValue;
    }

    if (
      selectedIndicatorFilterArray?.length
      && aggregatedValue
      && typeof aggregatedValue === 'object'
      && !Array.isArray(aggregatedValue)
    ) {
      const selectedIndicatorPath = selectedIndicator?.dataPath || selectedIndicator?.value || selectedIndicator;
      return aggregatedValue?.[selectedIndicatorPath] ?? aggregatedValue;
    }

    return aggregatedValue;
  };

  const resolvePathWithGetter = (currentPath, { useRootBase = false } = {}) => {
    if (!currentPath) {
      return currentPath;
    }

    const currentPathArray = currentPath.split('.');
    const selectorDataPath = selectorPath?.dataPath;
    const selectedIndicatorValue = selectedIndicator?.value || selectedIndicator;
    const spliceIndex = currentPathArray.length - (config?.splicePosition || 2);

    if (isHorizontalBarWithSelector) {
      return currentPathArray
        .map((pathPart, index) => {
          if (selectedIndicator && index === currentPathArray.length - 1) {
            return selectedIndicatorValue;
          }

          return pathPart;
        })
        .join('.');
    }

    if (selectorDataPath) {
      const newDataPathArray = [];

      if (useRootBase) {
        newDataPathArray.push(currentPathArray[0]);
      } else if (config?.dataPathBase) {
        config.dataPathBase.split('.').forEach((pathPart) => {
          newDataPathArray.push(pathPart);
        });
      }

      selectorDataPath.split('.').forEach((pathPart) => {
        newDataPathArray.push(pathPart);
      });

      if (!filterArray?.length) {
        newDataPathArray.push(selectedIndicatorValue || currentPathArray[currentPathArray.length - 1]);
      }

      return newDataPathArray.join('.');
    }

    if (selectorFilterArray?.length) {
      if (!useRootBase && config?.dataPathBase) {
        return config.dataPathBase;
      }

      return currentPathArray.slice(0, spliceIndex).join('.');
    }

    if (selectedIndicatorFilterArray?.length) {
      if (!useRootBase && config?.dataPathBase) {
        return config.dataPathBase;
      }

      return currentPathArray.slice(0, -1).join('.');
    }

    return currentPathArray
      .map((pathPart, index) => {
        if (selectorPath && index === spliceIndex) {
          return selectorPath?.value || selectorPath;
        }
        if (selectedIndicator && index === currentPathArray.length - 1) {
          return selectedIndicatorValue;
        }
        return pathPart;
      })
      .join('.');
  };

  // console.log({manifest})
  const selectedIndicatorManifest = manifest?.[selectedIndicatorManifestKey] || {};

  // console.log({ config });

  useEffect(() => {
    // console.log('Data', {data, dataPath, projectedDataPath, key});

    if (data) {
      setDerivedMaxValue(null);
      setDerivedDate(null);

      const resolvedCalculation = config?.dataCalculation
        ? {
          ...config.dataCalculation,
          terms: (config.dataCalculation.terms || []).map(term => (
            term?.path
              ? { ...term, path: resolvePathWithGetter(term.path, { useRootBase: true }) }
              : term
          ))
        }
        : null;

      const nestedData = resolvedCalculation
        ? calculateDataSeries({
          data,
          calculation: resolvedCalculation,
          key,
          manifest,
          getSeries: path => getGetterNestedValue(data, path)
        })
        : getGetterNestedValue(data, dataPath);

      if (chart?.valueType === 'mostCurrent' && !config?.comparisonPaths) {
        let mostCurrentKey = null;
        Object.values(nestedData || {}).forEach((item) => {
          Object.keys(item).forEach((dateKey) => {
            dateKey > mostCurrentKey
              ? mostCurrentKey = dateKey
              : !mostCurrentKey
                ? mostCurrentKey = dateKey
                : null;
          })
        })
        // console.log('Most Current Key', {mostCurrentKey, nestedData});
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
            adjustedData[dataKey] = dataValue ? dataValue / 90 : 0;
          });
          // console.log('Adjusted Data', adjustedData);
          setAllSummaryData(adjustedData);
        } else {
          setAllSummaryData(nestedData);
        }
        //
        // setAllSummaryData(getNestedValue(data, dataPath, key));
        if (projectedDataPath) {
          setProjectedData(getGetterNestedValue(data, projectedDataPath));
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

        if (config?.comparisonPaths && Array.isArray(config?.comparisonPaths)) {
          if (denominatorData) {
            const adjustedData = {};
            config.comparisonPaths.forEach(({ path, label }) => {
              const comparisonValue = getNestedValue(data, path, key);
              if (denominatorData[label]) {
                adjustedData[label] = 100 * (comparisonValue * (summary?.calculator === 'x1000' ? 1000 : 1)) / denominatorData[label];
              } else {
                adjustedData[label] = null;
              }
            });
            setComparisonData(adjustedData);

          } else if (chart?.valueType === 'mostCurrent') {
            let mostCurrentKey = null;

            // console.log('Most Current Key', {mostCurrentKey, nestedData});

            config.comparisonPaths.forEach(({ path, label }) => {
              const comparisonValue = getNestedValue(data, path, key);
              // console.log('Comparison Value', { comparisonValue, path });
              // Object.values(comparisonValue || {}).forEach((item) => {
              Object.keys(comparisonValue || {}).forEach((dateKey) => {
                dateKey > mostCurrentKey
                  ? mostCurrentKey = dateKey
                  : !mostCurrentKey
                    ? mostCurrentKey = dateKey
                    : null;
              })
              // })
              // comparisonData[label] = comparisonValue ? comparisonValue[derivedDate] : null;
            });
            setDerivedDate(mostCurrentKey);

            const mostCurrentData = {};
            config.comparisonPaths.forEach(({ path, label }) => {
              const comparisonValue = getNestedValue(data, path, key);
              // console.log('Comparison Value for Most Current', { comparisonValue, path });
              // Object.entries(comparisonValue || {}).forEach(([dataKey, dataValue]) => {
              //   if (chart?.exclude && chart?.exclude.includes(dataKey)) {
              //     return;
              //   }
              mostCurrentData[label] = comparisonValue?.[mostCurrentKey] || null;
              // });
            });
            const total = Object.values(mostCurrentData).reduce((acc, value) => acc + (value || 0), 0);
            setComparisonDataTotal(total);
            setComparisonData(mostCurrentData);
          }
          else {
            const comparisonData = {};
            config.comparisonPaths.forEach(({ path, label }) => {
              comparisonData[label] = getNestedValue(data, path, key);
            });
            // console.log({path: config?.comparisonPaths, comparisonData});
            setComparisonData(comparisonData);
          }
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
    denominatorData,
    projectedDataPath,
    selectedIndicator,
    selectorPath,
    filterArray
  ]);

  useEffect(() => {
    if (config?.denominatorPath) {
      setDenominatorData(getNestedValue(data, config.denominatorPath, key));
    } else {
      setDenominatorData(null);
    }
  }, [data, config?.denominatorPath, key]);


  useEffect(() => {

    if (
      getter?.[getterKey?.selectorPath] ||
      getter?.[getterKey?.selectedIndicator] ||
      config?.dataPath
    ) {
      const currentPath = summary?.dataPath || config?.dataPath;
      const resolvedDataPath = resolvePathWithGetter(currentPath);

      if (resolvedDataPath) {
        setDataPath(resolvedDataPath);
      }
    }

    if (
      getter?.[getterKey?.selectorPath] ||
      getter?.[getterKey?.selectedIndicator] ||
      config?.projectedDataPath
    ) {
      const currentPath = config?.projectedDataPath;
      const resolvedProjectedDataPath = resolvePathWithGetter(currentPath, { useRootBase: true });

      if (resolvedProjectedDataPath) {
        setProjectedDataPath(resolvedProjectedDataPath);
      }
    }

  },
    [
      getter?.[getterKey?.selectorPath],
      getter?.[getterKey?.selectedIndicator],
      config?.dataPath,
      config?.projectedDataPath,
      config?.denominatorPath,
      summary?.dataPath
      

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

  const selectedIndicatorLabel = selectedIndicatorManifest?.[selectedIndicator?.label || selectedIndicator] || selectedIndicator?.label || selectedIndicator;

  // Resolve a single token name to its display value.
  const resolveSubHeadingToken = (token) => {
    switch (token.trim()) {
      case 'selectorPath': {
        const val = selectorPath?.label || selectorPath;
        return val && String(val).toLowerCase() !== 'total' ? String(val) : null;
      }
      case 'indicatorPath':
      case 'indicator':
        return selectedIndicatorLabel ? String(selectedIndicatorLabel) : null;
      case 'geo':
        return config?.indicator?.Geography || null;
      case 'date':
        return derivedDate
          ? formatQuarterDate(derivedDate, 'QX YYYY', lng)
          : summaryData?.currentDate
            ? formatQuarterDate(summaryData.currentDate, 'QX YYYY', lng)
            : null;
      default:
        return token.trim() || null; // treat as a literal string
    }
  };

  // When config.subHeadingItems is an array each element may contain || for fallbacks.
  // Elements are resolved and joined with ', '.
  console.log(config?.subHeadingItems, 'config.subHeadingItems');
  const subHeadingText = config?.subHeadingItems
    ? config.subHeadingItems
      .map(item =>
        item
          .split('||')
          .map(t => resolveSubHeadingToken(t.trim()))
          .find(v => v) || null
      )
      .filter(Boolean)
      .join(', ')
    : `${(selectorPath && selectedIndicator) || selectedIndicator
      ? `${selectedIndicatorLabel}, ${selectorPath?.label || selectorPath || config?.indicator?.Geography}`
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
          ? `${selectedIndicatorLabel}`
          : config?.defaultSubheading || config?.indicator?.Geography
    }${derivedDate ? `, ${formatQuarterDate(derivedDate, 'QX YYYY', lng)}` : ''}`;
  // console.log({ trendDataType });

  useEffect(() => {
    if (data && allSummaryData) {
      // console.log('allSummaryData', allSummaryData);
      setSummaryData(
        createCompareDataObject(
          summary?.calculator,
          allSummaryData,
          trendDataType,
          summary?.filter,
          null,
          config?.summary?.showZeroValues
        )
      );
    } else {
      setSummaryData({
        displayValue: null,
        currentValue: null,
        currentDate: null,
        compareValue: null,
        compareDate: null
      });
    }
  }, [allSummaryData, trendDataType]);

  const labelFormatter = (value, formatters) => {
    let valueFormatted = value;
    formatters?.forEach((formatter) => {
      if (formatter === 'capitalizeFirstLetter') {
        valueFormatted = `${valueFormatted}`.charAt(0).toUpperCase() + `${valueFormatted}`.slice(1);
      }
      if (formatter?.type === 'replace') {
        valueFormatted = valueFormatted.replace(new RegExp(formatter.arguments?.[0], formatter.arguments?.[2] || 'g'), formatter.arguments?.[1]);
      }
    });
    return valueFormatted;
  }

  // console.log('Variables in Simple Card', variables);
  const variableInfo = variables?.find(variable =>
    variable.Variable?.toLowerCase() === label?.toLowerCase() ||
    variable.ChartLabel?.toLowerCase() === label?.toLowerCase()
  )
  // console.log('Variable Info', variableInfo);
  // console.log({allSummaryData});
  let totalValue = 0;

  const noManifestValue = [];
  Object.keys(allSummaryData || {}).forEach((dataKey) => {
    const manifestValue = config?.manifest?.[dataKey];
    if (!manifestValue && Object.keys(config?.manifest || {})?.length > 5) {
      noManifestValue.push(dataKey);
    }
  });
  // console.log('Total Value', totalValue, {noManifestValue});
  // console.log('Rendering SimpleCard', config?.summary?.showZeroValues, summaryData?.displayValue);

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
            <InfoIcon config={variableInfo || config?.indicator} popup />
          </div>
        </div>

        {viewType === 'mobile' && !cardFullSize && !disablePill ? (
          <TrendPill
            positiveTrendDirection={summary?.positiveTrendDirection}
            currentValue={summaryData.currentValue}
            compareValue={summaryData.compareValue}
            compareDate={summaryData.compareDate}
            units={config?.summary?.trendUnits}
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
      {(viewType !== 'mobile' || cardFullSize) && chart?.type !== 'horizontal-bar' ? (
        <>
          <div
            className='simple-data-wrapper'
          // onClick={() => 
          //   route
          //   // setSelectedLink(sectionKey);
          //    ? navigate(route)
          //    : null
          // }
          >

            {chart && <div
              className='simple-chart'
              style={summary?.formatter === 'legend'
                ? {
                  width: 'calc(40% - 10px)',
                  height: 'fit-content',
                  // border: '1px solid orange',
                } : !summary
                  ? {
                    width: 'calc(90% - 10px)',
                    height: '120px',
                  }
                  : {}}
            >
              {chart?.type && allSummaryData ? (
                <SimpleChart
                  wide={!summary}
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
                  comparisonData={comparisonData}
                  comparisonColors={{
                    ...config?.comparisonPaths?.reduce((acc, { label, color }) => {
                      acc[label] = color;
                      return acc;
                    }, {}),
                    total: config?.comparisonTotalColor || '#333333'
                  }}
                // comparisonDataTotal={comparisonDataTotal}
                // derivedMaxValue={derivedMaxValue}
                />
              ) : null}
            </div>}
            {
              summary && <div
                className='simple-data bold-font'
                style={!chart ? {
                  width: '100%',
                  gap: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }
                  : summary.formatter === 'legend'
                    ? {
                      width: '60%',
                      display: 'flex',
                      flexDirection: 'column',
                      // gap: '10px',
                      justifyContent: 'flex-end',
                      height: 'fit-content'
                    }
                    : {}}
              >
                {
                  summary.formatter === 'legend' && comparisonData
                    ? Object.entries(comparisonData).map(([key, value]) => (
                      <>
                        <h2
                          className='bold-font'
                          style={{
                            paddingLeft: '20px',
                            whiteSpace: 'nowrap',
                            width: 'fit-content !important',
                            overflow: 'visible',
                          }}
                        >
                          {(value || value === 0) && summary?.calculator === 'percentFromCounts'
                            ? formatValue(
                              (value / comparisonDataTotal) * 100,
                              config?.summary?.trendUnits,
                              null,
                              null,
                              config?.summary?.showZeroValues
                            )
                            : value || value === 0
                              ? formatValue(
                                value,
                                config?.summary?.trendUnits,
                                null,
                                null,
                                config?.summary?.showZeroValues
                              )
                              : '-'}
                        </h2>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '5px',
                          paddingBottom: '10px',
                        }}>
                          <div style={{
                            // display: 'inline-block',
                            width: '15px',
                            height: '15px',
                            borderRadius: '50%',
                            border: chart?.outline
                              ? `1px solid ${chart.outline}`
                              : null,
                            backgroundColor: config?.comparisonPaths?.find(pathObj => pathObj.label === key)?.color || '#333333',
                          }}>

                          </div>
                          <h5 className='simple-units'>{key}</h5>

                        </div>
                      </>
                    ))
                    : <h2 className='bold-font'
                      style={{
                        whiteSpace: 'nowrap',
                        width: 'fit-content !important',
                        overflow: 'visible',

                      }}
                    >
                      {summaryData.displayValue || (summaryData.displayValue === 0)
                        ? formatValue(
                          summaryData.displayValue,
                          config?.summary?.trendUnits,
                          null,
                          null,
                          config?.summary?.showZeroValues)
                        : '-'}
                    </h2>
                }
                <div>
                  {units ? <h5 className='simple-units'>{units}</h5> : null}
                  {summaryData?.currentDate
                    ? <h5 className='simple-indicator-date'>{formatQuarterDate(summaryData.currentDate, 'QX YYYY', lng)}</h5>
                    : null}
                </div>
              </div>
            }

          </div>
          <div
            style={chart2
              ? {
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                alignItems: 'flex-start',
                marginTop: '20px'
              }
              : {}
            }
          >
            {chart2?.type && allSummaryData ? (

              <div className='simple-chart'>

                <SimpleChart
                  wide={!summary}
                  lng={lng}
                  key={`${dataPath}-${cardKey}-simple-chart2`}
                  config={chart2}
                  viewType={viewType}
                  projectedData={projectedData}
                  data={
                    chart2.type !== 'donut'
                      ? allSummaryData
                      : { key: summaryData.currentDate, value: summaryData.displayValue }
                  }
                  comparisonData={comparisonData}
                  comparisonColors={{
                    ...config?.comparisonPaths?.reduce((acc, { label, color }) => {
                      acc[label] = color;
                      return acc;
                    }, {}),
                    total: config?.comparisonTotalColor || '#333333'
                  }}
                // comparisonDataTotal={comparisonDataTotal}
                // derivedMaxValue={derivedMaxValue}
                />

              </div>
            ) : null}
            {!disablePill && (viewType !== 'mobile' || cardFullSize) ? (
              <TrendPill
                lng={lng}
                positiveTrendDirection={summary?.positiveTrendDirection}
                currentValue={summaryData.currentValue}
                compareValue={summaryData.compareValue}
                compareDate={summaryData.compareDate}
                units={config?.summary?.trendUnits}
                data={allSummaryData}
                compareValueUnderPill={chart2 ? true : false}
                trendDataType={trendDataType}
                displayCompareText
                onlyYears={config?.dateType === 'year'}
              />
            ) : null}
          </div>

        </>
      ) : null}
      {
        chart?.type === 'horizontal-bar' ? (
          <div style={{
            height: '100%',
            maxHeight: '280px',
            marginTop: '20px',
            marginBottom: '10px',
            width: '100%',
            overflowY: 'auto',
            gap: chart.wrapLabels ? '12px' : '12px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {Object.entries(allSummaryData || {})

              .filter(([barKey, barValue]) => {
                if (chart?.type === 'horizontal-bar' && selectorFilterArray?.length && !selectorFilterArray.includes(barKey)) {
                  return false;
                }
                if (chart?.values?.min) {
                  if (barValue === null || barValue === undefined || barValue < chart.values.min) {
                    return false;
                  }
                }
                if (chart?.exclude && chart?.exclude.includes(barKey)) {
                  return false;
                }
                if (barValue === null || barValue === undefined) {
                  return false;
                }
                return true;
              })
              .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
              .sort((a, b) => {
                const { orderArray } = chart;
                if (orderArray && orderArray.length) {
                  const aIndex = orderArray.indexOf(a[0]);
                  const bIndex = orderArray.indexOf(b[0]);
                  if (aIndex === -1 && bIndex === -1) {
                    return 0;
                  } else if (aIndex === -1) {
                    return 1;
                  } else if (bIndex === -1) {
                    return -1;
                  } else {
                    return aIndex - bIndex;
                  }
                }
                return 0;
              })
              .filter(([_, barValue], index) => {
                totalValue += barValue;
                if (chart?.values?.countMax) {
                  return index < chart.values.countMax;
                }
                return true;
              })
              .map(([barKey, barValue]) => (
                <div
                  key={`${dataPath}-horizontal-bar-${barKey}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    // marginBottom: chart.wrapLabels ? '0px' : '8px',
                  }}
                >
                  <div style={{
                    width: '40%',
                    height: chart.wrapLabels ? 'fit-content' : '20px',
                    lineHeight: 'normal',
                    textAlign: 'right',
                  }}>
                    <h5 style={{
                      height: chart.wrapLabels ? 'fit-content' : '20px',
                      lineHeight: chart.wrapLabels ? '.8rem' : '20px',
                      overflow: chart.wrapLabels ? 'visible' : 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: chart.wrapLabels ? 'normal' : 'nowrap',
                      paddingRight: chart.wrapLabels ? '10px' : '10px'
                    }} className='horizontal-bar-label'>
                      {
                        labelFormatter(
                          config?.manifest?.[barKey] || barKey,
                          chart?.labelFormatters
                            ? [...chart.labelFormatters]
                            : chart?.labelFormatter
                              ? [chart?.labelFormatter] : [])
                      }
                      {/* {chart?.labelFormatter === 'capitalizeFirstLetter' 
                        ? `${config?.manifest?.[barKey] || barKey}`.charAt(0).toUpperCase() + `${config?.manifest?.[barKey] || barKey}`.slice(1)
                        : config?.manifest?.[barKey] || barKey} */}
                    </h5>
                  </div>
                  <div style={{
                    width: 'calc(60% - 60px)',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap'
                  }}>
                    <div
                      style={{
                        width: `${barValue / derivedMaxValue * 100}%`,
                        minWidth: `${barValue / derivedMaxValue * 100}%`,
                        backgroundColor: chart.color || 'var(--primary-color)',
                        height: '20px',
                        textAlign: 'right',
                      }}
                    >
                    </div>
                    <div
                      className='horizontal-bar-value'
                      style={{ marginLeft: '5px' }}
                    >{formatValue(barValue, chart.values?.formatter || null, null, totalValue)}</div>
                  </div>
                </div>
              ))}
          </div>

        ) : null
      }
      {
        devMode && (
          <div style={{ width: '100%' }}>
            <br />
            <div style={{
              color: chart?.color || 'black',
              fontSize: '8px',
              fontFamily: 'monospace'
            }}>
              {`Data Path: `}{dataPath}{config?.denominatorPath ? ` / ${config?.denominatorPath}` : null}
              <br />{`Chart Type: `}{chart?.type}
              <span style={{ color: chart2?.color || 'black' }}>
                {chart2?.type ? ` + ${chart2.type}` : ''}
              </span>
              <br />
              {`Trend Data Type: `}{trendDataType
                ? config?.dateType === 'year'
                  ? trendDataType === 'YtY'
                    ? 'N/A'
                    : 'YtY'
                  : trendDataType
                : null}
            </div>
            <div style={{
              color: 'red',
              fontSize: '8px',
              fontFamily: 'monospace'
            }}>
              {noManifestValue.length
                ? <div>
                  <div>No manifest value for: </div>
                  <table style={{
                    color: 'black',
                    fontSize: '8px',
                    fontFamily: 'monospace'

                  }}>
                    {
                      noManifestValue.map(value =>
                        <tr><td>{value}</td></tr>)
                    }
                  </table>
                </div>
                : null}
            </div>
            <button
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                fontSize: '10px',
                fontFamily: 'monospace',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({ content: config }, null, 2));
                alert('Config copied to clipboard!');
              }}
            >
              Copy Config to Clipboard
            </button>
          </div>
        )
      }

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
