import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Reactive by Design',
    icon: '🔄',
    description: (
      <>
        Built with reactivity at its core. Refractions automatically update your UI
        when state changes, eliminating the need for manual DOM manipulation.
      </>
    ),
  },
  {
    title: 'Composable Architecture',
    icon: '🧩',
    description: (
      <>
        Create reusable optics and lenses that encapsulate complex logic.
        Build applications with modular, testable, and maintainable components.
      </>
    ),
  },
  {
    title: 'Developer Experience',
    icon: '⚡',
    description: (
      <>
        Familiar React-like syntax with modern JavaScript features.
        TypeScript support, excellent tooling, and comprehensive error messages.
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon} role="img">{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
