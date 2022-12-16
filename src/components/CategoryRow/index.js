import React, {useEffect, useState} from 'react';
import Card from '../Card';
import './style.css';

const CategoryRow = ({
  project, 
  category, 
  categoryData, 
  manifest, 
  mapConfig,
  tractGeoJSON
}) => {
const [indicators, setIndicators] = useState();

  useEffect(() => {
    const indicatorsArray = [];
    Object.keys(categoryData)
      .forEach(key => indicatorsArray.push(key))
    setIndicators(indicatorsArray)
  },[categoryData]);

  return (
    <div className='category-row'>
      <div className='category-header'>
        {category.toUpperCase()}
      </div>
      <div className='indicator-cards'>
        { indicators
            ? indicators.map(indicator => 
               <Card
                tractGeoJSON={tractGeoJSON}
                mapConfig={mapConfig}
                category={category}
                project={project}
                manifest={manifest}
                indicator={indicator}
                indicatorData={categoryData[indicator]}
               />
              )
            : 'No Indicators'

        }

      </div>
    </div>
  )
};

export default CategoryRow;