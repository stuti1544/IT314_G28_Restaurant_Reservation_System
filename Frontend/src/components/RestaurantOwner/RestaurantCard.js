import React from 'react';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({ name, cuisine, image, onCardClick, onButtonClick }) => {
  const handleCardClick = (e) => {
    // Prevent the modal from being triggered by button clicks
    if (onCardClick) {
      onCardClick(e);
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); // Prevent the event from bubbling to the card click handler
    if (onButtonClick) {
      onButtonClick(action); // Pass the action ('edit' or 'manage')
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={image || 'default-image.jpg'} // Fallback to a default image if no image is provided
          alt={name}
          className={styles.image}
        />
      </div>
      <h3>{name}</h3>
      <p>Cuisine: {cuisine}</p>
      <div className={styles.buttonsContainer}>
        <button
          className={styles.button}
          onClick={(e) => handleButtonClick(e, 'edit')}
        >
          Edit
        </button>
        <button
          className={styles.button}
          onClick={(e) => handleButtonClick(e, 'manage')}
        >
          Manage
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
