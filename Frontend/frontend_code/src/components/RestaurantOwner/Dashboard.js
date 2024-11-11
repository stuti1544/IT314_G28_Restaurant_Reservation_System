import React, { useState } from 'react';
import Sidebar from './Sidebar';
import RestaurantCard from './RestaurantCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Restaurant data with dynamic attributes
  const initialRestaurants = [
    { id: 1, name: 'Gourmet Grub', cuisine: 'Italian', image: 'path/to/image1.jpg' },
    { id: 2, name: 'Spice Symphony', cuisine: 'Indian', image: 'path/to/image2.jpg' },
    { id: 3, name: 'Sushi Central', cuisine: 'Japanese', image: 'path/to/image3.jpg' },
    { id: 4, name: 'Taco Town', cuisine: 'Mexican', image: 'path/to/image4.jpg' },
];


  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');

  // Filtered restaurants based on search and cuisine filter
  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      restaurant.cuisine.toLowerCase().includes(filterCuisine.toLowerCase())
    );
  });

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
              />
            ))
          ) : (
            <p>No restaurants found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
