import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar1.module.css";

// Centralized location list
const locations = [
  "All Locations",
  "Mumbai",
  "Beijing",
  "Tokyo",
  "Mexico City",
  "Florence",
  "Shanghai",
  "Jaipur",
];

const Navbar1 = ({ filterByLocation }) => {
  const navigate = useNavigate();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    filterByLocation(location === "All Locations" ? null : location);
    setShowLocationDropdown(false);
  };

  return (
    <div className={styles.navbar}>
      {/* Home Button */}
      <button className={styles.brand} onClick={() => navigate("/user-dashboard")}>
        Fork & Feast
      </button>

      {/* Location Dropdown */}
      <div
        className={styles.locationDropdown}
        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
      >
        <button className={styles.dropdownButton}>{selectedLocation}</button>
        {showLocationDropdown && (
          <div className={styles.dropdownMenu}>
            {locations.map((loc, index) => (
              <button
                key={index}
                onClick={() => handleLocationChange(loc)}
                className={styles.dropdownItem}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by cuisine, food, location, etc."
        className={styles.searchBar}
      />

      {/* About Us, Become a Member, and Profile */}
      <div className={styles.rightSection}>
        <button className={styles.optionButton} onClick={() => navigate("/user-dashboard/about-us")}>
          About Us
        </button>
        <button
          className={styles.optionButton}
          onClick={() => navigate("/user-dashboard/become-a-member")}
        >
          Become a Member
        </button>
        <div
          className={styles.profile}
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <button className={styles.profileBtn}>VG</button>
          {showProfileDropdown && (
            <div className={styles.profileDropdown}>
              <button onClick={() => navigate("/user-dashboard/profile")}>My Profile</button>
              <button onClick={() => navigate("/user-dashboard/bookings")}>Bookings</button>
              <button onClick={() => navigate("/user-dashboard/favourites")}>Favourites</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar1;
