import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RestaurantModel.module.css";

const RestaurantModal = ({ restaurant, onClose }) => {
  const navigate = useNavigate();

  const handleBookTable = () => {
    if (restaurant && restaurant.id) {
      navigate(`/user-dashboard/book-table/${restaurant.id}`); // Navigate to booking page
    } else {
      console.error("Restaurant ID is not available.");
    }
  };
  

  if (!restaurant) return null; // Handle missing restaurant data gracefully

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.imageContainer}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className={styles.mainImage}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.name}>{restaurant.name}</h2>
          <p className={styles.rating}>
            <strong>Rating:</strong> {restaurant.rating} ⭐
          </p>
          <p className={styles.specialDishes}>
            <strong>Special Dishes:</strong> {restaurant.specialDishes}
          </p>
          <p className={styles.location}>
            <strong>Location:</strong> {restaurant.location}
          </p>

          <button
            className={styles.bookButton}
            onClick={handleBookTable}
            disabled={!restaurant.booking}
          >
            {restaurant.booking ? "Book Table" : "Booking Unavailable"}
          </button>

          <div className={styles.photos}>
            {restaurant.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${restaurant.name} ${index + 1}`}
                className={styles.photo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal;
