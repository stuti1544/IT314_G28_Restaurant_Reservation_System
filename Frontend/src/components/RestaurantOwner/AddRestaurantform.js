import React, { useState, useRef, useEffect } from 'react';
import './AddRestaurantform.css';

function AddRestaurantform({ restaurantData, onSave }) {
  const initialFormData = {
    name: '',
    location: '',
    images: [],
    menuImages: [],
    capacity: { twoPerson: 0, fourPerson: 0, sixPerson: 0 },
    cuisines: [],
    openingTime: '',
    closingTime: '',
    phoneNumber: '',
    specialDishes: '',
    features: '',
    foodPreference: '',
  };

  // If restaurantData is passed (i.e. when editing), set formData to that data
  const [formData, setFormData] = useState(restaurantData || initialFormData);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [menuImagePreviews, setMenuImagePreviews] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showMenuImagePreview, setShowMenuImagePreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [menuCurrentPreviewIndex, setMenuCurrentPreviewIndex] = useState(0);

  const imageInputRef = useRef(null);
  const menuImageInputRef = useRef(null);

  useEffect(() => {
    if (restaurantData) {
      // Preload data when editing
      setFormData(restaurantData);
      setImagePreviews(restaurantData.images.map((img) => URL.createObjectURL(img)));
      setMenuImagePreviews(restaurantData.menuImages.map((img) => URL.createObjectURL(img)));
    }
  }, [restaurantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const newFiles = Array.from(e.target.files);

    if (newFiles.length === 0) return;
    if (name === 'images') {
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    } else if (name === 'menuImages') {
      setMenuImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleCapacityChange = (type, increment) => {
    setFormData((prevState) => {
      const newValue = Math.max(0, prevState.capacity[type] + increment);
      return {
        ...prevState,
        capacity: { ...prevState.capacity, [type]: newValue },
      };
    });
  };

  const handleCuisineChange = (cuisine) => {
    setFormData((prevState) => {
      const cuisines = prevState.cuisines.includes(cuisine)
        ? prevState.cuisines.filter((c) => c !== cuisine)
        : [...prevState.cuisines, cuisine];
      return { ...prevState, cuisines };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setImagePreviews([]);
    setMenuImagePreviews([]);
    setShowImagePreview(false);

    if (imageInputRef.current) imageInputRef.current.value = '';
    if (menuImageInputRef.current) menuImageInputRef.current.value = '';
  };

  const totalCapacity =
    formData.capacity.twoPerson * 2 +
    formData.capacity.fourPerson * 4 +
    formData.capacity.sixPerson * 6;

  const handlePrevImage = () => {
    if (showImagePreview) {
      setCurrentPreviewIndex((prevIndex) =>
        prevIndex === 0 ? imagePreviews.length - 1 : prevIndex - 1
      );
    } else if (showMenuImagePreview) {
      setMenuCurrentPreviewIndex((prevIndex) =>
        prevIndex === 0 ? menuImagePreviews.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (showImagePreview) {
      setCurrentPreviewIndex((prevIndex) =>
        prevIndex === imagePreviews.length - 1 ? 0 : prevIndex + 1
      );
    } else if (showMenuImagePreview) {
      setMenuCurrentPreviewIndex((prevIndex) =>
        prevIndex === menuImagePreviews.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleFoodPreferenceChange = (preference) => {
    setFormData({ ...formData, foodPreference: preference });
  };

  return (
    <div className="container">
      <span className="close-icon" onClick={() => console.log('Close form')}>
        ×
      </span>
      <h1 className="title">{restaurantData ? 'Edit' : 'Add'} Restaurant Details</h1>
      <form onSubmit={handleSubmit} className="form" noValidate={showImagePreview || showMenuImagePreview}>
        <div>
          <label>Restaurant Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => {
              if (/^\d{0,10}$/.test(e.target.value)) handleChange(e);
            }}
            required
          />
        </div>

        <div>
          <label>Ambience (Upload Images):</label>
          <input type="file" name="images" multiple onChange={handleFileChange} ref={imageInputRef} />
          {imagePreviews.length > 0 && (
            <button type="button" style={{ marginTop: '5px' }} onClick={() => setShowImagePreview(true)}>
              Preview Ambience Images
            </button>
          )}
          {showImagePreview && (
            <div className="preview-modal">
              <button onClick={handlePrevImage} className="nav-button left">
                ‹
              </button>
              <img src={imagePreviews[currentPreviewIndex]} alt="Preview" className="large-preview-image" />
              <button onClick={handleNextImage} className="nav-button right">
                ›
              </button>
              <button onClick={() => setShowImagePreview(false)} className="close-preview-button">
                Close Preview
              </button>
            </div>
          )}
        </div>

        <div>
          <label>Menu (Upload Images):</label>
          <input type="file" name="menuImages" multiple onChange={handleFileChange} ref={menuImageInputRef} />
          {menuImagePreviews.length > 0 && (
            <button type="button" style={{ marginTop: '5px' }} onClick={() => setShowMenuImagePreview(true)}>
              Preview Menu Images
            </button>
          )}
          {showMenuImagePreview && (
            <div className="preview-modal">
              <button onClick={handlePrevImage} className="nav-button left">
                ‹
              </button>
              <img src={menuImagePreviews[menuCurrentPreviewIndex]} alt="Preview" className="large-preview-image" />
              <button onClick={handleNextImage} className="nav-button right">
                ›
              </button>
              <button onClick={() => setShowMenuImagePreview(false)} className="close-preview-button">
                Close Preview
              </button>
            </div>
          )}
        </div>

        <div>
          <label>Capacity:</label>
          <div className="capacity-selector">
            <div>
              <label>2 Person Tables:</label>
              <button type="button" onClick={() => handleCapacityChange('twoPerson', -1)}>
                -
              </button>
              <span>{formData.capacity.twoPerson}</span>
              <button type="button" onClick={() => handleCapacityChange('twoPerson', 1)}>
                +
              </button>
            </div>
            <div>
              <label>4 Person Tables:</label>
              <button type="button" onClick={() => handleCapacityChange('fourPerson', -1)}>
                -
              </button>
              <span>{formData.capacity.fourPerson}</span>
              <button type="button" onClick={() => handleCapacityChange('fourPerson', 1)}>
                +
              </button>
            </div>
            <div>
              <label>6 Person Tables:</label>
              <button type="button" onClick={() => handleCapacityChange('sixPerson', -1)}>
                -
              </button>
              <span>{formData.capacity.sixPerson}</span>
              <button type="button" onClick={() => handleCapacityChange('sixPerson', 1)}>
                +
              </button>
            </div>
          </div>
        </div>

        <div>
          <label>Food Preference:</label>
          <div>
            <input
              type="radio"
              name="foodPreference"
              value="Vegetarian"
              checked={formData.foodPreference === 'Vegetarian'}
              onChange={() => handleFoodPreferenceChange('Vegetarian')}
            />
            Vegetarian
          </div>
          <div>
            <input
              type="radio"
              name="foodPreference"
              value="Non-Vegetarian"
              checked={formData.foodPreference === 'Non-Vegetarian'}
              onChange={() => handleFoodPreferenceChange('Non-Vegetarian')}
            />
            Non-Vegetarian
          </div>
          <div>
            <input
              type="radio"
              name="foodPreference"
              value="Vegan"
              checked={formData.foodPreference === 'Vegan'}
              onChange={() => handleFoodPreferenceChange('Vegan')}
            />
            Vegan
          </div>
        </div>

        <div>
          <label>Cuisines:</label>
          <input
            type="text"
            value={formData.cuisines.join(', ')}
            onChange={handleChange}
            name="cuisines"
            placeholder="Enter comma separated cuisines"
          />
        </div>

        <div>
          <label>Opening Time:</label>
          <input
            type="time"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Closing Time:</label>
          <input
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Special Dishes:</label>
          <input
            type="text"
            name="specialDishes"
            value={formData.specialDishes}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Features:</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Total Capacity:</label>
          <span>{totalCapacity}</span>
        </div>

        <div className="buttons">
          <button type="button" onClick={handleClear}>
            Clear
          </button>
          <button type="submit">
            {restaurantData ? 'Update' : 'Add'} Restaurant
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurantform;
