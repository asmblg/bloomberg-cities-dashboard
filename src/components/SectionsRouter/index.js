import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// import OverviewCard from '../OverviewCard';
// import SummaryCard from '../SummaryCard';
import Home from '../Home';
import DetailCard from '../DetailCard';
import AboutProject from '../AboutProject';
import DataDocumentation from '../DataDocumentation';

const SectionRouter = ({ project, sections, sectionKeys }) => (
  <Routes>
    {sectionKeys && sectionKeys[0]
      ? sectionKeys.map(key =>
        key === 'home' ? (
          <Route
            key={`home-route-${key}`}
            path={`/${project.toLowerCase()}`}
            element={<Home config={sections[key]} project={project} />}
          />
        ) : (
          <Route
            key={`detail-route-${key}`}
            path={`/${project.toLowerCase()}/${key}`}
            element={<DetailCard config={sections[key]} project={project} />}
          />
        )
      )
      : null}
    <Route
      key={'about-route'}
      path={`/${project.toLowerCase()}/about`}
      element={<AboutProject />}
    />
    <Route
      key={'docs-route'}
      path={`/${project.toLowerCase()}/docs`}
      element={<DataDocumentation />}
    />
  </Routes>
);

SectionRouter.propTypes = {
  project: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object
};

export default SectionRouter;
