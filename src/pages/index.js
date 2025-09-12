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
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className="hero__title">
              <span className={styles.titleMain}>{siteConfig.title}</span>
              <span className={styles.titleAccent}>Framework</span>
            </h1>
            <p className="hero__subtitle">
              A simple JavaScript tool that makes building websites easier. 
              Your website updates automatically when things change.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>Fast</div>
                <div className={styles.statLabel}>Super Quick</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>Auto</div>
                <div className={styles.statLabel}>Updates Itself</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>Easy</div>
                <div className={styles.statLabel}>Simple to Use</div>
              </div>
            </div>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/installation">
                <span>Start Now</span>
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/getting-started">
                <span>Learn How</span>
              </Link>
              <Link
                className="button button--outline button--secondary button--lg"
                to="/docs/api/overview">
                <span>All Features</span>
              </Link>
            </div>
          </div>
          <div className={styles.heroCode}>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeButtons}>
                  <span className={styles.codeButton} style={{background: '#ff5f56'}}></span>
                  <span className={styles.codeButton} style={{background: '#ffbd2e'}}></span>
                  <span className={styles.codeButton} style={{background: '#27ca3f'}}></span>
                </div>
                <div className={styles.codeTitle}>Counter.jsx</div>
              </div>
              <pre className={styles.codeBlock}>
                <code>{`import { createApp, createComponent } from 'refract';

const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  const theme = lens.useRefraction('light');
  
  const increment = () => count.set(prev => prev + 1);
  const toggleTheme = () => theme.set(
    prev => prev === 'light' ? 'dark' : 'light'
  );
  
  return (
    <div className={\`counter \${theme.value}\`}>
      <h2>Count: {count.value}</h2>
      <button onClick={increment}>
        Add One
      </button>
      <button onClick={toggleTheme}>
        {theme.value === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
});

createApp(Counter).mount('#root');`}</code>
              </pre>
            </div>
          </div>
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
