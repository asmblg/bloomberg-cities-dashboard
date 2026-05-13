import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import LandingPage from '../LandingPage';
import Home from '../Home';
import DetailCard from '../DetailCard';
import ApiDocumentation from '../ApiDocumentation';

const SectionRouter = ({
  project,
  sections,
  sectionKeys,
  viewType,
  noTabs,
  variables,
  // dashboardType,
  trendDataType,
  setTrendDataType,
  selectedLink,
  setSelectedLink
}) => (
  <Routes>
    <Route path={'/'} element={<LandingPage viewType={viewType} />} />

    <Route
      path={`/${project.toLowerCase()}/api-docs`}
      element={
        <ApiDocumentation
          project={project}
          viewType={viewType}
          noTabs={noTabs}
          selectedLink={selectedLink}
        />
      }
    />

    {sectionKeys?.[0]
      ? sectionKeys.map(key =>
        key === 'home' ? (
          <Route
            key={`home-route-${key}`}
            path={`/${project.toLowerCase()}`}
            element={
              <Home
                config={sections[key]}
                project={project}
                // dashboardType={dashboardType}
                viewType={viewType}
                trendDataType={trendDataType}
                setTrendDataType={setTrendDataType}
                setSelectedLink={setSelectedLink}
              />
            }
          />
        ) : (
          <Route
            key={`detail-route-${key}`}
            path={`/${project.toLowerCase()}/${key}`}
            element={
              <DetailCard
                noTabs={noTabs}
                config={sections[key]}
                variables={variables}
                sectionKey={key}
                project={project}
                viewType={viewType}
                trendDataType={trendDataType}
                setTrendDataType={setTrendDataType}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
              />
            }
          />
        )
      )
      : null}
  </Routes>
);

SectionRouter.propTypes = {
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  viewType: PropTypes.string,
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func
};

export default SectionRouter;
