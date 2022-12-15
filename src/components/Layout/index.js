import React, {useEffect, useState} from 'react';
import CategoryRow from '../CategoryRow';
import './style.css'

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
      
      <div id='header'>
        <div id='city-label'>
          {config ? config.project.toUpperCase() : null}
        </div>
        <div id='dashboard-title'>
          Economic Development Dashboard
        </div>

      </div>
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