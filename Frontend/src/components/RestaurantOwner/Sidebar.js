import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import styles from './Sidebar.module.css';

const Sidebar = () => (
  <div className={styles.sidebar}>
    <h2>Menu</h2>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/stats">Stats</Link></li>
      <li><Link to="/logout">Logout</Link></li>
    </ul>
    <div className={styles.addRestaurantButtonContainer}>
      <Link to="/add-restaurant" className={styles.addRestaurantButton}>Add Restaurant</Link> {/* Link to the new Add Restaurant page */}
    </div>
  </div>
);

export default Sidebar;
