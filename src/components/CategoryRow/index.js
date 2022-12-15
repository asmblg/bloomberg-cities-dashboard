import React, {useEffect, useState} from 'react';
import Card from '../Card';

const CategoryRow = ({category, categoryData, manifest}) => {
const [indicators, setIndicators] = useState();

  useEffect(() => {
    const indicatorsArray = [];
    Object.keys(categoryData)
      .forEach(key => indicatorsArray.push(key))
    setIndicators(indicatorsArray)
  },[categoryData]);

  return (
    <div>
      <div className='category-header'>
        {category.toUpperCase()}
      </div>
      <div className='indicator-cards'>
        { indicators
            ? indicators.map(indicator => 
               <Card
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