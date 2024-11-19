import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar1 from "./Navbar1";
import SlidingBanner from "./SlidingBanner";
import PopularCuisine from "./PopularCuisines";
import RestaurantList from "./RestaurantList";
import CuisinePage from "./CuisinePage";
import MyProfile from "./MyProfile";
import Bookings from "./Bookings";
import Favourites from "./Favourites";
import BecomeMember from "./BecomeMember";
import BookTable from "./BookTable"; // Import the BookTable component
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const [filteredLocation, setFilteredLocation] = React.useState(null);

  return (
    <div className={styles.dashboard}>
      <Navbar1 filterByLocation={setFilteredLocation} />

      <div className={styles.content}>
        <Routes>
          <Route
            index
            element={
              <>
                <SlidingBanner />
                <PopularCuisine />
                <RestaurantList filteredLocation={filteredLocation} />
              </>
            }
          />
          <Route path="cuisine/:type" element={<CuisinePage />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="become-member" element={<BecomeMember />} />
          <Route path="book-table/:restaurantId" element={<BookTable />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
