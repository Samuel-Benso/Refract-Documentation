import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Updates Automatically',
    icon: 'AUTO',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: (
      <>
        When you change something in your code, your website updates by itself.
        No need to refresh the page or write extra code to make things work.
        It just happens automatically.
      </>
    ),
    link: '/docs/concepts/components',
    linkText: 'Learn How It Works'
  },
  {
    title: 'Easy to Build With',
    icon: 'BUILD',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    description: (
      <>
        Make pieces of code that you can use again and again.
        Build websites with small parts that work together.
        Keep your code organized and easy to understand.
      </>
    ),
    link: '/docs/concepts/lenses',
    linkText: 'See Examples'
  },
  {
    title: 'Beginner Friendly',
    icon: 'LEARN',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    description: (
      <>
        Uses simple JavaScript that looks familiar.
        Comes with helpful error messages when something goes wrong.
        Great tools to help you learn and build faster.
      </>
    ),
    link: '/docs/installation',
    linkText: 'Start Learning'
  },
];

const TechHighlights = [
  { label: 'File Size', value: 'Very Small', icon: 'SIZE' },
  { label: 'Speed', value: 'Super Fast', icon: 'SPEED' },
  { label: 'TypeScript', value: 'Built In', icon: 'TYPE' },
  { label: 'Works With', value: 'Everything', icon: 'COMPAT' },
];

function Feature({icon, title, description, gradient, link, linkText}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureHeader}>
          <div 
            className={styles.featureIcon} 
            style={{ background: gradient }}
            role="img"
          >
            {icon}
          </div>
          <h3 className={styles.featureTitle}>{title}</h3>
        </div>
        <div className={styles.featureContent}>
          <p className={styles.featureDescription}>{description}</p>
          <Link 
            className={styles.featureLink}
            to={link}
          >
            {linkText} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function TechHighlight({label, value, icon}) {
  return (
    <div className={styles.techHighlight}>
      <div className={styles.techIcon}>{icon}</div>
      <div className={styles.techContent}>
        <div className={styles.techValue}>{value}</div>
        <div className={styles.techLabel}>{label}</div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Use Refract?</h2>
            <p className={styles.sectionSubtitle}>
              Simple tools that make building websites fun and easy
            </p>
          </div>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      
      <section className={styles.techSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Makes It Great</h2>
            <p className={styles.sectionSubtitle}>
              Fast, small, and works with all your favorite tools
            </p>
          </div>
          <div className={styles.techGrid}>
            {TechHighlights.map((highlight, idx) => (
              <TechHighlight key={idx} {...highlight} />
            ))}
          </div>
          <div className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>Ready to build something cool?</h3>
            <div className={styles.ctaButtons}>
              <Link 
                className="button button--primary button--lg"
                to="/docs/installation"
              >
                Start Building
              </Link>
              <Link 
                className="button button--secondary button--lg"
                to="/docs/tutorials/counter-app"
              >
                See Examples
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
