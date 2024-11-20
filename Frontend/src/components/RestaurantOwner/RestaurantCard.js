import React, { useState } from 'react';
import styles from './RestaurantCard.module.css';
import AddRestaurantform from './AddRestaurantform'; // Import the AddRestaurantform component

const RestaurantCard = ({ name, cuisine, image, onCardClick, onButtonClick }) => {
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  const handleCardClick = (e) => {
    
    if (onCardClick) {
      onCardClick(e);
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); 
    if (onButtonClick) {
      onButtonClick(action); // Pass the action ('edit' or 'manage')
    }
  };

  const closeEditForm = () => {
    setIsEditFormVisible(false); // Close the edit form
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={image || 'default-image.jpg'} 
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

      {/* Conditionally render the AddRestaurantform if isEditFormVisible is true */}
      {isEditFormVisible && (
        <div className={styles.formOverlay}>
          <AddRestaurantform closeForm={closeEditForm} />
        </div>
      )}
    </div>
  );
};

export default RestaurantCard;
