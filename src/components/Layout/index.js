import React, {useEffect, useState} from 'react';
import CategoryRow from '../CategoryRow';


const Layout = ({
  config, 
  cityData
  }) => {
  const [categories, setCategories] = useState();
  
  useEffect(() => {
    const categoriesArray = [];
    Object.keys(cityData.data.city)
      .forEach(key => categoriesArray.push(key))
    setCategories(categoriesArray)
  }, [cityData])

  return (
    <div id='layout'>
      { categories
          ? categories.map(category =>
            <CategoryRow 
              project={config.project}
              category={category}
              categoryData={cityData.data.city[category]}
              manifest={config.manifest}
            />)
          : 'No Categories'


      }
     
    </div>
  )
}

export default Layout