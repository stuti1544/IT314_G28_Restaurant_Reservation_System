import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserTypeSelection.module.css'; 
import customerImage from './images/Customer_Stick.png';
import ownerImage from './images/Owner_Stick.png';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <div className={styles.userSelection}>
      <h2>Select Your Role</h2>
      <div className={styles.buttonContainer}>
        <div className={styles.customerPart}>
          <div className={styles.imageContainer}>
            <img 
              src={customerImage} 
              alt="Customer" 
              style={{ maxWidth: '80%', maxHeight: '200px', height: 'auto' }} 
            />
          </div>
          <h3>I am a Customer</h3>
          <button onClick={() => handleSelection('customer')}>Select Customer</button>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.ownerPart}>
          <div className={styles.imageContainer}>
            <img 
              src={ownerImage} 
              alt="Restaurant Owner" 
              style={{ maxWidth: '80%', maxHeight: '200px', height: 'auto' }} 
            />
          </div>
          <h3>I am a Restaurant Owner</h3>
          <button onClick={() => handleSelection('owner')}>Select Owner</button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
