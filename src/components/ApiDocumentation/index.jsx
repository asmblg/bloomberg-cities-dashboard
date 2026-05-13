import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.css';

const publicRoutes = [
  {
    method: 'GET',
    path: '/api/v1/about',
    description: 'Returns the variables array for a given project and language. Use this to discover available data fields.',
    params: [
      { name: 'project', required: true },
      { name: 'lng', required: false, dynamic: 'languages' }
    ]
  },
  {
    method: 'GET',
    path: '/api/v1/data',
    description: 'Public read-only data endpoint that mirrors the UI payload contract.',
    params: [
      { name: 'project', required: true },
      { name: 'select', required: false, type: 'instructions' }
    ]
  },
  {
    method: 'GET',
    path: '/api/v1/geo',
    description: 'Public read-only geospatial endpoint for external integrations.',
    params: [
      { name: 'project', required: true },
      { name: 'geoType', required: true, dynamic: 'geoTypes' }
    ]
  }
];

const PRODUCTION_API_BASE = 'https://bloomberg-cities-dashboard-eu-eb6aebd069f7.herokuapp.com';

const API_BASE = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? PRODUCTION_API_BASE : '');

const normalizeBasePath = (basePath = '') => {
  if (!basePath || basePath === '/') {
    return '';
  }
  return basePath.replace(/\/+$/, '');
};

const getRuntimeBasePath = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const pathname = window.location.pathname || '';
  const apiDocsIndex = pathname.indexOf('/api-docs');

  if (apiDocsIndex === -1) {
    return '';
  }

  return normalizeBasePath(pathname.slice(0, apiDocsIndex));
};

const joinBaseAndPath = (basePath, path) => {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBasePath}${normalizedPath}`;
};


const RouteCard = ({ route, project, dynamicOptions }) => {
  const [paramValues, setParamValues] = useState({});
  // Initialize param values
  useEffect(() => {
    const initial = {};
    route.params.forEach(param => {
      if (param.dynamic && dynamicOptions[param.dynamic]) {
        initial[param.name] = dynamicOptions[param.dynamic][0] || '';
      } else if (param.name === 'project') {
        initial[param.name] = project;
      }
    });
    setParamValues(initial);
  }, [route, project, dynamicOptions]);

  const handleParamChange = (paramName, value) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };


  // For select param example toggling
  const [selectedExample, setSelectedExample] = useState(null);

  // Example select scenarios
  const selectExamples = [
    { value: 'data' },
    { value: 'data updatedOn' },
    { value: 'data.tourism updatedOn' }
  ];

  // Build the example URL from current param values
  const buildExampleUrl = () => {
    const queryParams = [];
    route.params.forEach(param => {
      if (param.type !== 'instructions') {
        const value = paramValues[param.name];
        if (value !== undefined && value !== null && value !== '') {
          queryParams.push(`${param.name}=${encodeURIComponent(value)}`);
        }
      }
    });
    // If select example is chosen, add it
    if (route.path === '/api/v1/data' && selectedExample) {
      queryParams.push(`select=${encodeURIComponent(selectedExample)}`);
    }
    const example = `${route.path}${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`;
    if (API_BASE) {
      return joinBaseAndPath(API_BASE, example);
    }

    return joinBaseAndPath(getRuntimeBasePath(), example);
  };

  const fullUrl = buildExampleUrl();

  return (
    <article className='api-doc-card'>
      <div className='api-doc-card-header'>
        <span className='api-doc-method'>{route.method}</span>
        <code className='api-doc-path'>{route.path}</code>
      </div>
      <p className='api-doc-description'>{route.description}</p>
      <div className='api-doc-meta'>
        <div className='api-doc-params-list'>
          <h4>Query params</h4>
          {route.params.map(param => (
            <div key={param.name}>
              {param.type === 'instructions' && route.path === '/api/v1/data' ? (
                <>
                  <div className='api-doc-param-label'>
                    <span className='api-doc-param-name'>{param.name}</span>
                    <span className={`api-doc-param-badge ${param.required ? 'required' : 'optional'}`}>
                      {param.required ? 'required' : 'optional'}
                    </span>
                  </div>
                  <div className='api-doc-param-instructions'>
                    <p>Use dot notation to retrieve nested fields. String multiple fields with spaces:</p>
                    <div style={{ fontSize: '0.95em', marginTop: 8 }}>
                      <div style={{ marginBottom: 2, color: '#666' }}>Example select strings (click to use):</div>
                      {selectExamples.map(ex => (
                        <span
                          key={ex.value}
                          onClick={() => setSelectedExample(selectedExample === ex.value ? null : ex.value)}
                          style={{
                            cursor: 'pointer',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            border: selectedExample === ex.value ? '2px solid #0070f3' : '1px solid #ccc',
                            background: selectedExample === ex.value ? '#e6f0fa' : '#f7f7f7',
                            color: selectedExample === ex.value ? '#0070f3' : '#333',
                            fontWeight: selectedExample === ex.value ? 'bold' : 'normal',
                            userSelect: 'none',
                            transition: 'border 0.1s, background 0.1s',
                            marginRight: 8,
                            marginBottom: 4,
                            display: 'inline-block'
                          }}
                        >
                          select={ex.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : param.type === 'instructions' ? (
                <>
                  <div className='api-doc-param-label'>
                    <span className='api-doc-param-name'>{param.name}</span>
                    <span className={`api-doc-param-badge ${param.required ? 'required' : 'optional'}`}>
                      {param.required ? 'required' : 'optional'}
                    </span>
                  </div>
                  <div className='api-doc-param-instructions'>
                    <p>Use dot notation to retrieve nested fields. String multiple fields with spaces:</p>
                    <code>select=updatedOn data.employment.total data.tourism</code>
                  </div>
                </>
              ) : (
                <>
                  <div className='api-doc-param-label'>
                    <span className='api-doc-param-name'>{param.name}</span>
                    <span className={`api-doc-param-badge ${param.required ? 'required' : 'optional'}`}>
                      {param.required ? 'required' : 'optional'}
                    </span>
                  </div>
                  {param.dynamic && dynamicOptions[param.dynamic] ? (
                    <select
                      className='api-doc-param-input'
                      value={paramValues[param.name] || ''}
                      onChange={e => handleParamChange(param.name, e.target.value)}
                    >
                      {param.required ? null : (
                        <option value=''>-- None --</option>
                      )}
                      {dynamicOptions[param.dynamic].map(option => (
                        <option key={option || 'null'} value={option || ''}>
                          {option || '(default)'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className='api-doc-param-input'
                      value={paramValues[param.name] || ''}
                      onChange={e => handleParamChange(param.name, e.target.value)}
                      disabled
                    >
                      <option value={project}>{project}</option>
                    </select>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div>
          <h4>Example</h4>
          {fullUrl ? (
            <a href={fullUrl} target="_blank" rel="noopener noreferrer">
              <code>{fullUrl}</code>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

RouteCard.propTypes = {
  route: PropTypes.shape({
    method: PropTypes.string,
    path: PropTypes.string,
    description: PropTypes.string,
    params: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  project: PropTypes.string.isRequired,
  dynamicOptions: PropTypes.object.isRequired
};

const ApiDocumentation = ({ project }) => {
  const [dynamicOptions, setDynamicOptions] = useState({ geoTypes: [], languages: [] });

  useEffect(() => {
    // Fetch geoTypes and languages from the backend
    const fetchOptions = async () => {
      try {
        const baseUrl = API_BASE || getRuntimeBasePath();
        
        // Fetch geoTypes
        const geoResponse = await fetch(`${joinBaseAndPath(baseUrl, '/ui/geo/types')}?project=${project}`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          setDynamicOptions(prev => ({
            ...prev,
            geoTypes: geoData.geoTypes || []
          }));
        }

        // Fetch languages
        const langResponse = await fetch(`${joinBaseAndPath(baseUrl, '/ui/config/languages')}?project=${project}`);
        if (langResponse.ok) {
          const langData = await langResponse.json();
          setDynamicOptions(prev => ({
            ...prev,
            languages: langData.languages || []
          }));
        }
      } catch (error) {
        console.error('Failed to fetch options:', error);
        // Fallback options
        setDynamicOptions(prev => ({
          ...prev,
          geoTypes: ['Census Tracts', 'County', 'State'],
          languages: [null, 'en', 'sk']
        }));
      }
    };

    if (project) {
      fetchOptions();
    }
  }, [project]);

  return (
    <main className='api-doc-page'>
      <section className='api-doc-hero'>
        <div>
          <p className='api-doc-eyebrow'>API documentation</p>
          <h1>{project} endpoints</h1>
          <code className='api-doc-current-path'>/{project}/api-docs</code>
          <p className='api-doc-intro'>
            Public read-only API routes for external clients and integrations.
          </p>
        </div>
      </section>

      <section className='api-doc-section'>
        <div className='api-doc-section-header'>
          <h2>Public API routes</h2>
          <p>These endpoints are versioned and exposed for external read-only consumers.</p>
        </div>
        <div className='api-doc-grid'>
          {publicRoutes.map(route => (
            <RouteCard
              key={route.path}
              route={route}
              project={project}
              dynamicOptions={dynamicOptions}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

ApiDocumentation.propTypes = {
  project: PropTypes.string.isRequired
};

export default ApiDocumentation;