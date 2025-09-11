import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'e35'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/introducing-refract',
    component: ComponentCreator('/blog/introducing-refract', '261'),
    exact: true
  },
  {
    path: '/blog/performance-optimization-guide',
    component: ComponentCreator('/blog/performance-optimization-guide', '360'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/advanced',
    component: ComponentCreator('/blog/tags/advanced', 'e70'),
    exact: true
  },
  {
    path: '/blog/tags/announcement',
    component: ComponentCreator('/blog/tags/announcement', '3d6'),
    exact: true
  },
  {
    path: '/blog/tags/best-practices',
    component: ComponentCreator('/blog/tags/best-practices', '699'),
    exact: true
  },
  {
    path: '/blog/tags/javascript',
    component: ComponentCreator('/blog/tags/javascript', 'fcb'),
    exact: true
  },
  {
    path: '/blog/tags/optimization',
    component: ComponentCreator('/blog/tags/optimization', '09c'),
    exact: true
  },
  {
    path: '/blog/tags/performance',
    component: ComponentCreator('/blog/tags/performance', '93a'),
    exact: true
  },
  {
    path: '/blog/tags/reactive',
    component: ComponentCreator('/blog/tags/reactive', '390'),
    exact: true
  },
  {
    path: '/blog/tags/ui',
    component: ComponentCreator('/blog/tags/ui', '1e9'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '008'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '792'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '2a7'),
            routes: [
              {
                path: '/docs/advanced/performance',
                component: ComponentCreator('/docs/advanced/performance', 'cef'),
                exact: true
              },
              {
                path: '/docs/advanced/testing',
                component: ComponentCreator('/docs/advanced/testing', '7ad'),
                exact: true
              },
              {
                path: '/docs/api',
                component: ComponentCreator('/docs/api', 'a3f'),
                exact: true
              },
              {
                path: '/docs/api/createApp',
                component: ComponentCreator('/docs/api/createApp', '090'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/createComponent',
                component: ComponentCreator('/docs/api/createComponent', 'e73'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/createOptic',
                component: ComponentCreator('/docs/api/createOptic', 'ae2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/overview',
                component: ComponentCreator('/docs/api/overview', '211'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useEffect',
                component: ComponentCreator('/docs/api/useEffect', 'a6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useFlash',
                component: ComponentCreator('/docs/api/useFlash', '3ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useLens',
                component: ComponentCreator('/docs/api/useLens', '5c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useOptic',
                component: ComponentCreator('/docs/api/useOptic', '6b0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/useRefraction',
                component: ComponentCreator('/docs/api/useRefraction', 'a76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/components',
                component: ComponentCreator('/docs/concepts/components', '749'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/effects',
                component: ComponentCreator('/docs/concepts/effects', '4d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/lenses',
                component: ComponentCreator('/docs/concepts/lenses', 'd44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/optics',
                component: ComponentCreator('/docs/concepts/optics', '635'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/refractions',
                component: ComponentCreator('/docs/concepts/refractions', '319'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/state-management',
                component: ComponentCreator('/docs/concepts/state-management', '781'),
                exact: true
              },
              {
                path: '/docs/contributing',
                component: ComponentCreator('/docs/contributing', '069'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '2a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/installation',
                component: ComponentCreator('/docs/installation', '176'),
                exact: true
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/animation-basics',
                component: ComponentCreator('/docs/tutorials/animation-basics', '270'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/counter-app',
                component: ComponentCreator('/docs/tutorials/counter-app', '680'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/getting-started',
                component: ComponentCreator('/docs/tutorials/getting-started', '1ff'),
                exact: true
              },
              {
                path: '/docs/tutorials/global-theme',
                component: ComponentCreator('/docs/tutorials/global-theme', 'a07'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/todo-list',
                component: ComponentCreator('/docs/tutorials/todo-list', '447'),
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
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
