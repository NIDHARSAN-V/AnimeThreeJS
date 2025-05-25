import React from 'react';
import styles from './Loader.module.css';

const AnimatedBoxes = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
    </div>
  );
};

export default AnimatedBoxes;
