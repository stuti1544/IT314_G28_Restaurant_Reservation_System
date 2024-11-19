import React from "react";
import styles from "./RC.module.css";

const RC = ({ restaurant, onClick }) => {
  return (
    <button className={styles.card} onClick={onClick}>
      <img src={restaurant.image} alt={restaurant.name} className={styles.image} />
      <div className={styles.name}>{restaurant.name}</div>
    </button>
  );
};

export default RC;
