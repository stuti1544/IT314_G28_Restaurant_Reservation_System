import React from 'react';
import styles from './RestaurantModal.module.css';

const RestaurantModal = ({ restaurant, onClose }) => {
  if (!restaurant) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalContent}>
          <img src={restaurant.image} alt={restaurant.name} className={styles.modalImage} />
          <h2>{restaurant.name}</h2>
          <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          {/* Conditionally render the location */}
          {restaurant.location && (
            <p><strong>Location:</strong> {restaurant.location}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal;
