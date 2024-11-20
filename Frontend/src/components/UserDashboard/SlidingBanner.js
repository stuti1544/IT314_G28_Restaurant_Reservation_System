import React, { useState, useEffect } from "react";
import styles from "./SlidingBanner.module.css";

const SlidingBanner = () => {
  const banners = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      text: "Flat 50% off on your first order!" 
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      text: "Weekend special: Buy 1 Get 1 Free!" 
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      text: "Free Delivery on orders above $20!" 
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className={styles.bannerContainer}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`${styles.banner} ${
            index === currentIndex ? styles.active : ""
          }`}
        >
          <img src={banner.image} alt={banner.text} className={styles.image} />
          <div className={styles.text}>{banner.text}</div>
        </div>
      ))}
    </div>
  );
};

export default SlidingBanner;
