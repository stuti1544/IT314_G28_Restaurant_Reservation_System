import React, { useState } from 'react';
import styles from './RestaurantCard.module.css';
import AddRestaurantform from './AddRestaurantform'; // Import the AddRestaurantform component

const RestaurantCard = ({ name, cuisine, image, onCardClick, onButtonClick }) => {
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

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
    if (action === 'edit') {
      setIsEditFormVisible(true); // Show the edit form when 'Edit' button is clicked
    }
  };

  const closeEditForm = () => {
    setIsEditFormVisible(false); // Close the edit form
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
