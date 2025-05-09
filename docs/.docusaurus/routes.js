import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/goaltracker/__docusaurus/debug/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/', 'dce'),
    exact: true
  },
  {
    path: '/goaltracker/__docusaurus/debug/config/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/config/', '885'),
    exact: true
  },
  {
    path: '/goaltracker/__docusaurus/debug/content/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/content/', '0af'),
    exact: true
  },
  {
    path: '/goaltracker/__docusaurus/debug/globalData/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/globalData/', '872'),
    exact: true
  },
  {
    path: '/goaltracker/__docusaurus/debug/metadata/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/metadata/', 'c1d'),
    exact: true
  },
  {
    path: '/goaltracker/__docusaurus/debug/registry/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/registry/', '0d2'),
    exact: true
  },
  {
    path: '/goaltracker/__docusaurus/debug/routes/',
    component: ComponentCreator('/goaltracker/__docusaurus/debug/routes/', '4b0'),
    exact: true
  },
  {
    path: '/goaltracker/',
    component: ComponentCreator('/goaltracker/', 'e80'),
    routes: [
      {
        path: '/goaltracker/',
        component: ComponentCreator('/goaltracker/', '804'),
        routes: [
          {
            path: '/goaltracker/',
            component: ComponentCreator('/goaltracker/', '5c3'),
            routes: [
              {
                path: '/goaltracker/api-testing-tools/',
                component: ComponentCreator('/goaltracker/api-testing-tools/', 'f11'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/apply/',
                component: ComponentCreator('/goaltracker/apply/', '13f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/hands-on-api-testing/',
                component: ComponentCreator('/goaltracker/hands-on-api-testing/', 'fe0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/installation/',
                component: ComponentCreator('/goaltracker/installation/', '466'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/introduction/',
                component: ComponentCreator('/goaltracker/introduction/', '2d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/quickstart/',
                component: ComponentCreator('/goaltracker/quickstart/', 'c9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/testscenarios/',
                component: ComponentCreator('/goaltracker/testscenarios/', '036'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/wrap-up/',
                component: ComponentCreator('/goaltracker/wrap-up/', '555'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/goaltracker/',
                component: ComponentCreator('/goaltracker/', '8d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
