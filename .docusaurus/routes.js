import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', '04d'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/blog/authors/all-sebastien-lorber-articles', '4a1'),
    exact: true
  },
  {
    path: '/blog/authors/yangshun',
    component: ComponentCreator('/blog/authors/yangshun', 'a68'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '89a'),
    exact: true
  },
  {
    path: '/blog/introducing-refract',
    component: ComponentCreator('/blog/introducing-refract', '261'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '9ad'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'e9f'),
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
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '704'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '858'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '299'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '00d'),
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
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'd2b'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'a56'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '927'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '2a1'),
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
                path: '/docs/developers/api-overview',
                component: ComponentCreator('/docs/developers/api-overview', 'dd6'),
                exact: true
              },
              {
                path: '/docs/developers/authentication',
                component: ComponentCreator('/docs/developers/authentication', 'fe3'),
                exact: true
              },
              {
                path: '/docs/developers/endpoints',
                component: ComponentCreator('/docs/developers/endpoints', 'e85'),
                exact: true
              },
              {
                path: '/docs/developers/integration-guide',
                component: ComponentCreator('/docs/developers/integration-guide', 'a75'),
                exact: true
              },
              {
                path: '/docs/developers/webhooks',
                component: ComponentCreator('/docs/developers/webhooks', '7fc'),
                exact: true
              },
              {
                path: '/docs/faqs/general',
                component: ComponentCreator('/docs/faqs/general', '10c'),
                exact: true
              },
              {
                path: '/docs/faqs/troubleshooting',
                component: ComponentCreator('/docs/faqs/troubleshooting', 'a6f'),
                exact: true
              },
              {
                path: '/docs/features/api-access',
                component: ComponentCreator('/docs/features/api-access', '8d9'),
                exact: true
              },
              {
                path: '/docs/features/dashboard',
                component: ComponentCreator('/docs/features/dashboard', '8d2'),
                exact: true
              },
              {
                path: '/docs/features/realtime-feedback',
                component: ComponentCreator('/docs/features/realtime-feedback', 'd66'),
                exact: true
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '2a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', '2f7'),
                exact: true
              },
              {
                path: '/docs/getting-started/quick-tour',
                component: ComponentCreator('/docs/getting-started/quick-tour', '365'),
                exact: true
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
                path: '/docs/Introduction/faq',
                component: ComponentCreator('/docs/Introduction/faq', '864'),
                exact: true
              },
              {
                path: '/docs/Introduction/getting-started',
                component: ComponentCreator('/docs/Introduction/getting-started', '166'),
                exact: true
              },
              {
                path: '/docs/Introduction/overview',
                component: ComponentCreator('/docs/Introduction/overview', '213'),
                exact: true
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
