import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PopularCuisines.module.css";

const PopularCuisine = () => {
  const cuisines = ["Indian", "Chinese", "Mexican", "Italian", "Japanese"];
  const navigate = useNavigate();

  const handleCuisineClick = (cuisine) => {
    navigate(`/user-dashboard/cuisine/${cuisine.toLowerCase()}`);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Popular Cuisines</h3>
      <div className={styles.cuisines}>
        {cuisines.map((cuisine, index) => (
          <button
            key={index}
            className={styles.cuisineBtn}
            onClick={() => handleCuisineClick(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularCuisine;
