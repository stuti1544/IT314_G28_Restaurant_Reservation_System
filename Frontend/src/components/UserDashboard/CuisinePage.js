import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RC from "./RC";
import RestaurantModal from "./RestaurantModal";
import restaurantData from "./restaurantData"; // Import data file
import styles from "./CuisinePage.module.css";

const CuisinePage = () => {
  const { type } = useParams(); // Get cuisine type from URL
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Filter restaurants based on the cuisine type
  const filteredRestaurants = restaurantData.filter(
    (restaurant) => restaurant.cuisine.toLowerCase() === type.toLowerCase()
  );

  if (filteredRestaurants.length === 0) {
    return <p>No restaurants found for "{type}" cuisine.</p>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{type} Cuisine</h3>
      <div className={styles.cardsContainer}>
        {filteredRestaurants.map((restaurant) => (
          <RC
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => setSelectedRestaurant(restaurant)} // Set selected restaurant
          />
        ))}
      </div>
      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant} // Pass the selected restaurant
          onClose={() => setSelectedRestaurant(null)} // Close modal handler
        />
      )}
    </div>
  );
};

export default CuisinePage;
