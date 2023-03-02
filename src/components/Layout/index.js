// Packages
import React from 'react';

// Components
import Header from '../Header';
import OverviewCard from '../OverviewCard';
import Footer from '../Footer';
// import CategoryRow from '../CategoryRow';

// Styling/Configuration/Utilities
import './style.css';

const Layout = () => {
  // prev props: config, cityData, tractGeoJSON
  // const [categories, setCategories] = useState();

  // useEffect(() => {
  //   const categoriesArray = [];
  //   Object.keys(cityData.data.city).forEach(key => categoriesArray.push(key));
  //   setCategories(categoriesArray);
  // }, [cityData]);

  return (
    <div id='layout'>
      <Header />
      {/* <OverviewCard /> */}
      <Footer />
      {/* <div id='header'>
        <div id='city-label'>{config ? config.project.toUpperCase() : null}</div>
        <div id='dashboard-title'>Economic Development Dashboard</div>
      </div>
      {categories
        ? categories.map(category => (
          <CategoryRow
            key={`cat-row-${category}`}
            mapConfig={config.map}
            project={config.project}
            category={category}
            categoryData={cityData.data.city[category]}
            manifest={config.manifest}
            tractGeoJSON={tractGeoJSON}
          />
        ))
        : 'No Categories'} */}
    </div>
  );
};

export default Layout;
