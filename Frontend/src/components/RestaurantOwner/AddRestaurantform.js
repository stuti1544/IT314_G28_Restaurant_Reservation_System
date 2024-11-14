  import React, { useState,useRef } from 'react';
  import './AddRestaurantform.css';

  function AddRestaurantform() {
    const initialFormData = {
      name: '',
      location: '',
      images: [],
      menuImages: [],
      capacity: { twoPerson: 0, fourPerson: 0, sixPerson: 0 },
      cuisines: [],
      openingTime: '',
      closingTime: '',
      phoneNumber: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [menuImagePreviews, setMenuImagePreviews] = useState([]);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [showMenuImagePreview,setShowMenuImagePreview] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const [menuCurrentPreviewIndex, setMenuCurrentPreviewIndex] = useState(0); 

    const imageInputRef = useRef(null);
    const menuImageInputRef = useRef(null);

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
          ...newFiles.map((file) => URL.createObjectURL(file))
        ]);
      } else if (name === 'menuImages') {
        setMenuImagePreviews((prevPreviews) => [
          ...prevPreviews,
          ...newFiles.map((file) => URL.createObjectURL(file))
        ]);
      }
    };





    const handleCapacityChange = (type, increment) => {
      setFormData(prevState => {
        const newValue = Math.max(0, prevState.capacity[type] + increment);
        return { 
          ...prevState, 
          capacity: { ...prevState.capacity, [type]: newValue }
        };
      });
    };

    const handleCuisineChange = (cuisine) => {
      setFormData(prevState => {
        const cuisines = prevState.cuisines.includes(cuisine)
          ? prevState.cuisines.filter(c => c !== cuisine)
          : [...prevState.cuisines, cuisine];
        return { ...prevState, cuisines };
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
    };

    const handleClear = () => {
      setFormData(initialFormData);
      setImagePreviews([]);
      setMenuImagePreviews([]);
      setShowImagePreview(false);

      if (imageInputRef.current) imageInputRef.current.value = '';
      if (menuImageInputRef.current) menuImageInputRef.current.value = '';
    };

    const totalCapacity = formData.capacity.twoPerson * 2 + formData.capacity.fourPerson * 4 + formData.capacity.sixPerson * 6;

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
        <span className="close-icon" onClick={() => console.log("Close form")}>×</span>
        <h1 className="title">Add Restaurant details</h1>
        <form onSubmit={handleSubmit} className="form" noValidate={showImagePreview || showMenuImagePreview}>
          <div>
            <label>Restaurant Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
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
          <input type="file" name="images" multiple onChange={handleFileChange} ref={imageInputRef}/>
          {imagePreviews.length > 0 && (
            <button type="button" style={{ marginTop: '5px' }} onClick={() => setShowImagePreview(true)}>
              Preview Ambience Images
            </button>
          )}
          {showImagePreview && (
            <div className="preview-modal">
              <button onClick={handlePrevImage} className="nav-button left">‹</button>
              <img src={imagePreviews[currentPreviewIndex]} alt="Preview" className="large-preview-image" />
              <button onClick={handleNextImage} className="nav-button right">›</button>
              <button onClick={() => setShowImagePreview(false)} className="close-preview-button">
                Close Preview
              </button>
            </div>
          )}
        </div>
          
        <div>
          <label>Menu (Upload Images):</label>
          <input type="file" name="menuImages" multiple onChange={handleFileChange} ref={menuImageInputRef}/>
          {menuImagePreviews.length > 0 && (
            <button type="button" style={{ marginTop: '5px' }} onClick={() => setShowMenuImagePreview(true)}>
              Preview Menu Images
            </button>
          )}
          {showMenuImagePreview && (
            <div className="preview-modal">
              <button onClick={handlePrevImage} className="nav-button left">‹</button>
              <img src={menuImagePreviews[menuCurrentPreviewIndex]} alt="Preview" className="large-preview-image" />
              <button onClick={handleNextImage} className="nav-button right">›</button>
              <button onClick={() => setShowMenuImagePreview(false)} className="close-preview-button">
                Close Preview
              </button>
            </div>
          )}
        </div>

          <div>
            <label>Capacity:</label>
            <div className="capacity-selector ">
              <div>
                <label>2 Person Tables:</label>
                <button type="button" onClick={() => handleCapacityChange('twoPerson', -1)}>-</button>
                <span>{formData.capacity.twoPerson}</span>
                <button type="button" onClick={() => handleCapacityChange('twoPerson', 1)}>+</button>
              </div>
              <div>
                <label>4 Person Tables:</label>
                <button type="button" onClick={() => handleCapacityChange('fourPerson', -1)}>-</button>
                <span>{formData.capacity.fourPerson}</span>
                <button type="button" onClick={() => handleCapacityChange('fourPerson', 1)}>+</button>
              </div>
              <div>
                <label>6 Person Tables:</label>
                <button type="button" onClick={() => handleCapacityChange('sixPerson', -1)}>-</button>
                <span>{formData.capacity.sixPerson}</span>
                <button type="button" onClick={() => handleCapacityChange('sixPerson', 1)}>+</button>
              </div>
              <div className="total-capacity">Total Capacity: {totalCapacity}</div>
            </div>
          </div>

          <div>
            <label>Food Preference:</label>
            <div className="food-preference-selector">
              <label>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Pure Veg"
                  checked={formData.foodPreference === 'Pure Veg'}
                  onChange={() => handleFoodPreferenceChange('Pure Veg')}
                />
                Pure Veg
              </label>
              <label>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Pure Non-Veg"
                  checked={formData.foodPreference === 'Pure Non-Veg'}
                  onChange={() => handleFoodPreferenceChange('Pure Non-Veg')}
                />
                Pure Non-Veg
              </label>
              <label>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Both"
                  checked={formData.foodPreference === 'Both'}
                  onChange={() => handleFoodPreferenceChange('Both')}
                />
                Both
              </label>
            </div>
          </div>

          <div>
            <label>Cuisines:</label>
            <div className="cuisine-selector">
              {['Indian', 'Chinese', 'Mexican', 'Italian', 'Japanese','Fast Food'].map((cuisine, index) => (
                <label key={index}>
                  <input 
                    type="checkbox" 
                    checked={formData.cuisines.includes(cuisine)} 
                    onChange={() => handleCuisineChange(cuisine)} 
                  />
                  {cuisine}
                </label>
              ))}
            </div>
          </div>

          <div>
          <label>Special Dishes:</label>
          <input
            type="text"
            name="specialDishes"
            value={formData.specialDishes}
            onChange={(e) => {
              if (e.target.value.length <= 60) handleChange(e);
            }}
            maxLength="60"
          />
        </div>

        <div>
          <label>Features:</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={(e) => {
              if (e.target.value.length <= 120) handleChange(e);
            }}
            maxLength="120"
          />
        </div>


          <div>
            <label>Opening Hours:</label>
            <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} required />
          </div>

          <div>
            <label>Closing Hours:</label>
            <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} required />
          </div>

          <div className="col-span-2">
            <label>Location:</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={(e) => {
                if (e.target.value.length <= 75) handleChange(e);
              }}
              rows="2"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="button-primary button-submit">Submit</button>
            <button type="button" className="button-primary button-clear" onClick={handleClear}>Clear</button>
          </div>
        </form>
      </div>
    );
  }

  export default AddRestaurantform;
