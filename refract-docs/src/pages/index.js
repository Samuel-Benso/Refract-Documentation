import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Get Started - 5min ⏱️
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/api/overview"
            style={{marginLeft: '1rem'}}>
            API Reference
          </Link>
        </div>
        <div className={styles.codeExample}>
          <pre className={styles.codeBlock}>
            <code>{`import { createApp, createComponent } from 'refract';

const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  
  return (
    <button onClick={() => count.set(count.value + 1)}>
      Clicked {count.value} times
    </button>
  );
});

createApp(Counter).mount('#root');`}</code>
          </pre>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="A reactive, composable JavaScript framework for building modern UIs">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
