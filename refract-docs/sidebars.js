/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/components',
        'concepts/refractions',
        'concepts/lenses',
        'concepts/optics',
        'concepts/effects',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/createApp',
        'api/createComponent',
        'api/useRefraction',
        'api/useEffect',
        'api/useOptic',
        'api/useFlash',
        'api/useLens',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/counter-app',
        'tutorials/todo-list',
        'tutorials/global-theme',
        'tutorials/animation-basics',
      ],
    },
    'contributing',
  ],
};

module.exports = sidebars;
