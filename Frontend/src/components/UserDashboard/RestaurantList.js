import React, { useState } from "react";
import RC from "./RC";
import RestaurantModal from "./RestaurantModal";
import restaurantData from "./restaurantData"; // Import the centralized restaurant data
import styles from "./RestaurantList.module.css";

const RestaurantList = ({ filteredLocation }) => {
  // State for Modal
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Filtering Logic based on location
  const filteredRestaurants =
    filteredLocation === null
      ? restaurantData // Use centralized data
      : restaurantData.filter((restaurant) => restaurant.location === filteredLocation);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Restaurants Near You</h3>

      {/* Restaurant Cards */}
      <div className={styles.cardsContainer}>
        {filteredRestaurants.map((restaurant) => (
          <RC
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => setSelectedRestaurant(restaurant)} // Set selected restaurant
          />
        ))}
      </div>

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant} // Pass the selected restaurant
          onClose={() => setSelectedRestaurant(null)} // Close modal handler
        />
      )}
    </div>
  );
};

export default RestaurantList;

