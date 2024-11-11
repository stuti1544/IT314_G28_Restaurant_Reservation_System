import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => (
  <div className={styles.sidebar}>
    <h2>Menu</h2>
    <ul>
      <li>Home</li>
      <li>Profile</li>
      <li>Stats</li>
      <li>Logout</li>
    </ul>
  </div>
);

export default Sidebar;
