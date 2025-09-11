import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'a49'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '0e7'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '1e3'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '659'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '4b8'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'b50'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'bfb'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '4b7'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', 'f47'),
    exact: true
  },
  {
    path: '/blog/introducing-refract',
    component: ComponentCreator('/blog/introducing-refract', 'e18'),
    exact: true
  },
  {
    path: '/blog/performance-optimization-guide',
    component: ComponentCreator('/blog/performance-optimization-guide', '39b'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '01d'),
    exact: true
  },
  {
    path: '/blog/tags/advanced',
    component: ComponentCreator('/blog/tags/advanced', '7d4'),
    exact: true
  },
  {
    path: '/blog/tags/announcement',
    component: ComponentCreator('/blog/tags/announcement', 'f19'),
    exact: true
  },
  {
    path: '/blog/tags/best-practices',
    component: ComponentCreator('/blog/tags/best-practices', '538'),
    exact: true
  },
  {
    path: '/blog/tags/javascript',
    component: ComponentCreator('/blog/tags/javascript', '27f'),
    exact: true
  },
  {
    path: '/blog/tags/optimization',
    component: ComponentCreator('/blog/tags/optimization', '85c'),
    exact: true
  },
  {
    path: '/blog/tags/performance',
    component: ComponentCreator('/blog/tags/performance', '89c'),
    exact: true
  },
  {
    path: '/blog/tags/reactive',
    component: ComponentCreator('/blog/tags/reactive', '35c'),
    exact: true
  },
  {
    path: '/blog/tags/ui',
    component: ComponentCreator('/blog/tags/ui', '322'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '96a'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '594'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'aa9'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'b38'),
            routes: [
              {
                path: '/docs/api/createApp',
                component: ComponentCreator('/docs/api/createApp', 'f05'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/createComponent',
                component: ComponentCreator('/docs/api/createComponent', '0a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/overview',
                component: ComponentCreator('/docs/api/overview', '79e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useEffect',
                component: ComponentCreator('/docs/api/useEffect', '6ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useFlash',
                component: ComponentCreator('/docs/api/useFlash', '74b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useLens',
                component: ComponentCreator('/docs/api/useLens', '15d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useOptic',
                component: ComponentCreator('/docs/api/useOptic', 'e77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useRefraction',
                component: ComponentCreator('/docs/api/useRefraction', 'f39'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/components',
                component: ComponentCreator('/docs/concepts/components', '5b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/effects',
                component: ComponentCreator('/docs/concepts/effects', '45a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/lenses',
                component: ComponentCreator('/docs/concepts/lenses', '382'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/optics',
                component: ComponentCreator('/docs/concepts/optics', 'da5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/refractions',
                component: ComponentCreator('/docs/concepts/refractions', '96d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/contributing',
                component: ComponentCreator('/docs/contributing', 'ff2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', 'a24'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/installation',
                component: ComponentCreator('/docs/installation', 'b2a'),
                exact: true
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'aed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/animation-basics',
                component: ComponentCreator('/docs/tutorials/animation-basics', 'ac8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/counter-app',
                component: ComponentCreator('/docs/tutorials/counter-app', '774'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/global-theme',
                component: ComponentCreator('/docs/tutorials/global-theme', '456'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/todo-list',
                component: ComponentCreator('/docs/tutorials/todo-list', 'aad'),
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
    path: '/',
    component: ComponentCreator('/', 'b9e'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
