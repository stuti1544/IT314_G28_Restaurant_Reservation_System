import React, { useState } from 'react';
import './editprofile.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    setSubmittedData({ name, email }); // Store the submitted data
  };

  return (
    <div className="App">
      <div className="editprofile">
        <div className="title-button-container">
          <h1>Edit Your Owner Details</h1>
        </div>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-box"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-box"
          />
          <div className="button-container">
            <button type="button" className="submit-button cancel-button">Cancel</button>
            <button type="submit" className="submit-button save-button">Save Changes</button>
          </div>
          <button type="submit" className="submit-button final-submit-button">Submit</button>
        </form>

        {submittedData && (
          <div className="output">
            <h2>Submitted Information:</h2>
            <p>Name: {submittedData.name}</p>
            <p>Email: {submittedData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;