import React, { useState, useEffect, useRef } from "react";
import { useParams , useNavigate, useLocation } from "react-router-dom";
import fetchRestaurants from "./restaurantData";
import styles from "./BookTable.module.css";

const BookTable = () => {
  const { restaurantId, reservationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const isEditing = Boolean(reservationId) || location.state?.isEditing;

  // State declarations - remove duplicates
  const [bookingDetails, setBookingDetails] = useState({
    date: location.state?.reservationData?.date || "",
    time: location.state?.reservationData?.time || "",
    tables: {
      2: location.state?.reservationData?.tables?.twoPerson || 0,
      4: location.state?.reservationData?.tables?.fourPerson || 0,
      6: location.state?.reservationData?.tables?.sixPerson || 0
    }
  });

  const [selectedTime, setSelectedTime] = useState(location.state?.reservationData?.time || "");
  const [availableTables, setAvailableTables] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState({
    before: { time: "", tables: null },
    current: { time: "", tables: null },
    after: { time: "", tables: null }
  });

  // Modal State
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentPhotoSet, setCurrentPhotoSet] = useState([]);
  const [activeSection, setActiveSection] = useState("Offers");

  // Refs for each section
  const offersRef = useRef(null);
  const menuRef = useRef(null);
  const photosRef = useRef(null);
  const aboutRef = useRef(null);

  // Scroll to top on initial render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(`Fetching restaurant with ID: ${restaurantId}`);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/restaurant/${restaurantId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }

        const data = await response.json();
        console.log('Raw restaurant data:', data.restaurantData);
        
        if (data.restaurantData) {
          setRestaurant({
            id: data.restaurantData._id,
            name: data.restaurantData.name || '',
            location: data.restaurantData.location || '',
            image: Array.isArray(data.restaurantData.image) ? 
              data.restaurantData.image.map(img => `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`) : [],
            cuisines: data.restaurantData.cuisines || '',
            openingTime: data.restaurantData.openingTime || '',
            closingTime: data.restaurantData.closingTime || '',
            features: data.restaurantData.features || '',
            specialDishes: data.restaurantData.specialDishes || '',
            menuImage: Array.isArray(data.restaurantData.menuImage) ? 
              data.restaurantData.menuImage.map(img => `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`) : [],
            capacity: data.restaurantData.capacity || {
              twoPerson: 0,
              fourPerson: 0,
              sixPerson: 0
            }
          });

          console.log('Processed restaurant images:', Array.isArray(data.restaurantData.image) ? 
            data.restaurantData.image.map(img => `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`) : []);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        alert('Failed to load restaurant details. Please try again later.');
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId]);

  // Photo navigation handlers
  const handlePhotoClick = (photo, index, photoSet) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
    setCurrentPhotoSet(photoSet);
    setShowPhotoModal(true);
  };

  const handlePrevPhoto = () => {
    setPhotoIndex((prev) => (prev === 0 ? currentPhotoSet.length - 1 : prev - 1));
    setSelectedPhoto(currentPhotoSet[photoIndex === 0 ? currentPhotoSet.length - 1 : photoIndex - 1]);
  };

  const handleNextPhoto = () => {
    setPhotoIndex((prev) => (prev === currentPhotoSet.length - 1 ? 0 : prev + 1));
    setSelectedPhoto(currentPhotoSet[photoIndex === currentPhotoSet.length - 1 ? 0 : photoIndex + 1]);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
  };

  // Smooth scrolling function with left-right sliding effect
  const scrollToSection = (section) => {
    setActiveSection(section);
    const refMap = {
      Offers: offersRef,
      Menu: menuRef,
      Photos: photosRef,
      About: aboutRef,
    };

    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    }, 0);
  };

  // Handle Time Input Change
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    setBookingDetails((prev) => ({
      ...prev,
      time: newTime,
    }));
  };

  const isRestaurantOpen = (dateTime) => {
    const openTime = new Date(`${bookingDetails.date} ${restaurant.openingTime}`);
    const closeTime = new Date(`${bookingDetails.date} ${restaurant.closingTime}`);
    return dateTime >= openTime && dateTime <= closeTime;
  };

  // Check Time Availability
  const checkAvailability = async () => {
    if (!restaurant) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservation/checkAvailability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `application/json`
        },
        body: JSON.stringify({
          restaurantId: restaurantId,
          date: bookingDetails.date,
          time: selectedTime,
          currentReservationId: isEditing ? reservationId : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check availability');
      }

      const data = await response.json();
      console.log('Raw availability data:', data);

      const calculateActualAvailability = (slotTables, maxCapacity) => {
        let tables = { ...slotTables };
        
        if (isEditing && location.state?.reservationData?.tables) {
          const currentTables = location.state.reservationData.tables;
          tables = {
            2: Math.min(maxCapacity.twoPerson, (tables[2] || 0)),
            4: Math.min(maxCapacity.fourPerson, (tables[4] || 0)),
            6: Math.min(maxCapacity.sixPerson, (tables[6] || 0))
          };
        }
        
        return tables;
      };

      setTimeSlots({
        before: {
          time: data.beforeSlot.time,
          tables: calculateActualAvailability(data.beforeSlot.tables, restaurant.capacity),
          closed: !isRestaurantOpen(new Date(`${bookingDetails.date} ${data.beforeSlot.time}`))
        },
        current: {
          time: selectedTime,
          tables: calculateActualAvailability(data.currentSlot.tables, restaurant.capacity),
          closed: !isRestaurantOpen(new Date(`${bookingDetails.date} ${selectedTime}`))
        },
        after: {
          time: data.afterSlot.time,
          tables: calculateActualAvailability(data.afterSlot.tables, restaurant.capacity),
          closed: !isRestaurantOpen(new Date(`${bookingDetails.date} ${data.afterSlot.time}`))
        }
      });

      setShowAvailabilityModal(true);
    } catch (error) {
      console.error('Error checking availability:', error);
      alert(error.message);
    }
  };

  const selectTimeSlot = (slot) => {
    if (slot.closed) return;
    setSelectedTime(slot.time);
    setAvailableTables(slot.tables);
    setBookingDetails(prev => ({
      ...prev,
      time: slot.time,
      tables: { 2: 0, 4: 0, 6: 0 }
    }));
    setShowAvailabilityModal(false);
  };

  // Handle Date Change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBookingDetails((prev) => ({
      ...prev,
      date: newDate,
    }));
    setShowDateModal(false);
  };

  // Handle Table size changes
  const incrementTable = (size) => {
    if (bookingDetails.tables[size] < availableTables[size]) {
      setBookingDetails((prev) => ({
        ...prev,
        tables: { ...prev.tables, [size]: prev.tables[size] + 1 },
      }));
    }
  };

  const decrementTable = (size) => {
    if (bookingDetails.tables[size] > 0) {
      setBookingDetails((prev) => ({
        ...prev,
        tables: { ...prev.tables, [size]: prev.tables[size] - 1 },
      }));
    }
  };

  // Calculate the total number of people
  const getTotalPeople = () => {
    return (
      bookingDetails.tables[2] * 2 +
      bookingDetails.tables[4] * 4 +
      bookingDetails.tables[6] * 6
    );
  };

  // Calculate the number of tables booked

  const getTotalTables = () => {
    return (
      bookingDetails.tables[2] +
      bookingDetails.tables[4] +
      bookingDetails.tables[6]
    );
  };

  // Handle booking
  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!bookingDetails.date || !bookingDetails.time) {
        alert('Please select both date and time for your reservation');
        return;
      }

      const endpoint = isEditing 
        ? `${process.env.REACT_APP_API_URL}/reservation/updateReservation/${reservationId}`
        : `${process.env.REACT_APP_API_URL}/reservation/createReservation`;

      const method = isEditing ? 'PUT' : 'POST';
      
      console.log('Sending request to:', endpoint);
      console.log('Request data:', {
        restaurantId,
        date: bookingDetails.date,
        time: bookingDetails.time,
        tables: {
          twoPerson: bookingDetails.tables[2],
          fourPerson: bookingDetails.tables[4],
          sixPerson: bookingDetails.tables[6]
        }
      });

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurantId,
          date: bookingDetails.date,
          time: bookingDetails.time,
          tables: {
            twoPerson: bookingDetails.tables[2],
            fourPerson: bookingDetails.tables[4],
            sixPerson: bookingDetails.tables[6]
          }
        })
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(isEditing ? 'Reservation updated successfully!' : `Reservation successful! Your entry code is: ${data.reservation.entryCode}`);
      navigate('/user-dashboard/bookings');
    } catch (error) {
      console.error(isEditing ? 'Error updating reservation:' : 'Error creating reservation:', error);
      alert(error.message);
    }
  };

  // Calculate min and max dates for the date picker
  const getDateLimits = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    return {
      min: today.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  };

  if (!restaurant) {
    return <p className={styles.errorMessage}>Restaurant not found.</p>;
  }

  const getContentForSection = () => {
    switch (activeSection) {
      case "Offers":
        return restaurant.offers?.length ? (
          <div className={styles.cardContainer}>
            {restaurant.offers.map((offer, index) => (
              <div key={index} className={styles.offerCard}>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No offers available at the moment.</p>
        );
      case "Menu":
        return restaurant.menuImage?.length ? (
          <div className={styles.photoGrid}>
            {restaurant.menuImage.map((menuPhoto, index) => (
              <div key={index} className={styles.photoCard}>
                <img
                  src={menuPhoto}
                  alt={`Menu ${index + 1}`}
                  className={styles.photo}
                  onClick={() => handlePhotoClick(menuPhoto, index, restaurant.menuImage)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No menu photos available.</p>
        );
      case "Photos":
        {console.log(restaurant)}
        return restaurant.image?.length ? (
          <div className={styles.photoGrid}>
            {restaurant.image.map((photo, index) => (
              <div key={index} className={styles.photoCard}>
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={styles.photo}
                  onClick={() => handlePhotoClick(photo, index, restaurant.photos)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No photos available.</p>
        );
      case "About":
        return (
          <div className={styles.aboutSection}>
            <p>
              <strong>Address:</strong> {restaurant.location}
            </p>
            <p>
              <strong>Features:</strong> {restaurant.features}
            </p>
            <p>
              <strong>Special Dishes:</strong> {restaurant.specialDishes}
            </p>
            <p>
              <strong>Opening Hours:</strong> {restaurant.openingTime} - {restaurant.closingTime}
            </p>
          </div>
        );
      default:
        return <p>Select a section to view content.</p>;
    }
  };

  return (
    <div className={styles.container}>
      {restaurant && (
        <div className={styles.bannerSection}>
          <div className={styles.banner}>
            {restaurant.image && restaurant.image.length > 0 && (
              <div className={styles.imageContainer}>
                <img
                  src={restaurant.image[0]}
                  alt={restaurant.name}
                  className={styles.bannerImage}
                  onError={(e) => {
                    console.error('Failed to load image:', e.target.src);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className={styles.info}>
              <h1>{restaurant.name}</h1>
              <p>{restaurant.location}</p>
              <p>Cuisines: {restaurant.cuisines}</p>
              <p>Opening Hours: {restaurant.openingTime} - {restaurant.closingTime}</p>
            </div>
          </div>

          {/* Booking Section */}
          <div className={styles.bookingSection}>
            <h2>Book Your Table</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <button
                  type="button"
                  onClick={() => setShowDateModal(true)}
                  className={styles.dateButton}
                >
                  Select Date: {bookingDetails.date || "Choose a date"}
                </button>
              </div>

              <div className={styles.formGroup}>
                <h3>Select Time:</h3>
                <div className={styles.timeSelection}>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className={styles.timeInput}
                    min={restaurant.openingTime}
                    max={restaurant.closingTime}
                  />
                  <button
                    type="button"
                    onClick={checkAvailability}
                    className={styles.checkButton}
                    disabled={!bookingDetails.date || !selectedTime}
                  >
                    Check Availability
                  </button>
                </div>
              </div>

              {availableTables && (
                <div className={styles.formGroup}>
                  <h3>Available Tables:</h3>
                  {[2, 4, 6].map((size) => (
                    <div key={size} className={styles.tableType}>
                      <label>Table for {size} ({availableTables[size]} available):</label>
                      <div className={styles.quantityControls}>
                        <button type="button" onClick={() => decrementTable(size)}>
                          -
                        </button>
                        <span>{bookingDetails.tables[size]}</span>
                        <button type="button" onClick={() => incrementTable(size)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {getTotalTables() > 0 && (
                <button
                  type="button"
                  className={styles.bookButton}
                  onClick={handleBooking}
                >
                  {isEditing ? 'Update Reservation' : `Book ${getTotalTables()} table(s) for ${getTotalPeople()} people`}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Menu Bar */}
      <div className={styles.menuBar}>
        {["Offers", "Menu", "Photos", "About"].map((section) => (
          <button
            key={section}
            className={activeSection === section ? styles.active : ""}
            onClick={() => scrollToSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.sectionContent}>{getContentForSection()}</div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className={styles.photoModal} onClick={handleClosePhotoModal}>
          <div className={styles.photoModalContent} onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Selected" className={styles.modalPhoto} />
            <button className={styles.prevButton} onClick={handlePrevPhoto}>&lt;</button>
            <button className={styles.nextButton} onClick={handleNextPhoto}>&gt;</button>
            <button className={styles.closeModalButton} onClick={handleClosePhotoModal}>×</button>
          </div>
        </div>
      )}

      {/* Date Modal */}
      {showDateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Select a Date</h3>
            <input
              type="date"
              value={bookingDetails.date}
              onChange={handleDateChange}
              className={styles.dateInput}
              min={getDateLimits().min}
              max={getDateLimits().max}
            />
            <button onClick={() => setShowDateModal(false)} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className={styles.modal}>
          <div className={styles.availabilityContent}>
            <div className={styles.timeSlotContainer}>
              {/* Hour Before */}
              <div className={styles.timeSlotGroup}>
                <h4>{timeSlots.before.time}</h4>
                {timeSlots.before.closed ? (
                  <p>Restaurant will be closed at this time</p>
                ) : (
                  <>
                    <div className={styles.tableAvailability}>
                      <div>
                        <p>Available Tables:</p>
                        <p>2 seater: {timeSlots.before.tables[2]}</p>
                        <p>4 seater: {timeSlots.before.tables[4]}</p>
                        <p>6 seater: {timeSlots.before.tables[6]}</p>
                      </div>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button
                        onClick={() => selectTimeSlot(timeSlots.before)}
                        className={styles.selectButton}
                        disabled={timeSlots.before.closed}
                      >
                        Select
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Current Time */}
              <div className={styles.timeSlotGroup}>
                <h4>{timeSlots.current.time} (Selected Time)</h4>
                <div className={styles.tableAvailability}>
                  <div>
                    <p>Available Tables:</p>
                    <p>2 seater: {timeSlots.current.tables[2]}</p>
                    <p>4 seater: {timeSlots.current.tables[4]}</p>
                    <p>6 seater: {timeSlots.current.tables[6]}</p>
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => selectTimeSlot(timeSlots.current)}
                    className={styles.selectButton}
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* Hour After */}
              <div className={styles.timeSlotGroup}>
                <h4>{timeSlots.after.time}</h4>
                {timeSlots.after.closed ? (
                  <p>Restaurant is closed at this time</p>
                ) : (
                  <>
                    <div className={styles.tableAvailability}>
                      <div>
                        <p>Available Tables:</p>
                        <p>2 seater: {timeSlots.after.tables[2]}</p>
                        <p>4 seater: {timeSlots.after.tables[4]}</p>
                        <p>6 seater: {timeSlots.after.tables[6]}</p>
                      </div>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button
                        onClick={() => selectTimeSlot(timeSlots.after)}
                        className={styles.selectButton}
                        disabled={timeSlots.after.closed}
                      >
                        Select
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;