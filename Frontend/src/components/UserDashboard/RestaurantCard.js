import React from 'react';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({ name, cuisine, image }) => (
  <div className={styles.card}>
    <div className={styles.imageContainer}>
      <img
        src={image || 'default-image.jpg'} // Fallback to a default image if no image is provided
        alt={`${name}`}
        className={styles.image}
      />
    </div>
    <h3>{name}</h3>
    <p>Cuisine: {cuisine}</p>
    <div className={styles.buttonsContainer}>
      <button className={styles.button}>Edit</button>
      <button className={styles.button}>Manage</button>
    </div>
  </div>
);

export default RestaurantCard;
