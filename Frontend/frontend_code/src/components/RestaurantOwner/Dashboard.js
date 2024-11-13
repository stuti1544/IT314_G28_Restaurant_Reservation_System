import React, { useState } from 'react';
import Sidebar from './Sidebar';
import RestaurantCard from './RestaurantCard';
import RestaurantModal from './RestaurantModal';
import styles from './Dashboard.module.css';
import gourmetGrubImg from './images/gourmetgrub.jpg';
import spiceSymphonyImg from './images/indian.jpg';
import sushiCentralImg from './images/sushi.jpg';
import tacoTownImg from './images/taco.jpg';

const Dashboard = () => {
  const initialRestaurants = [
    { id: 1, name: 'Gourmet Grub', cuisine: 'Italian', image: gourmetGrubImg, location: '1234 Food St, Rome, Italy' },
    { id: 2, name: 'Spice Symphony', cuisine: 'Indian', image: spiceSymphonyImg, location: '4567 Spice Ave, New Delhi, India' },
    { id: 3, name: 'Sushi Central', cuisine: 'Japanese', image: sushiCentralImg, location: '8901 Sushi Rd, Tokyo, Japan' },
    { id: 4, name: 'Taco Town', cuisine: 'Mexican', image: tacoTownImg, location: '2345 Taco Blvd, Mexico City, Mexico' },
  ];

  const [restaurants] = useState(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [action, setAction] = useState(''); // To store the action (edit/manage)

  // Filter restaurants based on search and cuisine
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    restaurant.cuisine.toLowerCase().includes(filterCuisine.toLowerCase())
  );

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleButtonClick = (actionType) => {
    setAction(actionType); // Store the action ('edit' or 'manage')
    console.log(`${actionType} clicked`);
    // Add your logic for edit/manage here, like opening a different view or navigating
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.heading}>Your Restaurants</h1>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by cuisine..."
            className={styles.searchInput}
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
          />
        </div>

        {/* Restaurant Cards */}
        <div className={styles.cardsContainer}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                name={restaurant.name}
                cuisine={restaurant.cuisine}
                image={restaurant.image}
                onCardClick={() => handleCardClick(restaurant)}
                onButtonClick={handleButtonClick}
              />
            ))
          ) : (
            <p>No restaurants found.</p>
          )}
        </div>

        {/* Modal for restaurant details */}
        <RestaurantModal restaurant={selectedRestaurant} onClose={closeModal} />
      </div>
    </div>
  );
};

export default Dashboard;
