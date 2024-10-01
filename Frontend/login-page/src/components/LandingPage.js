// src/LandingPage.js
import React from 'react';
import Navbar from './Navbar';
import './LandingPage.css';
import Footer from './Footer';
import pizza from './images/pizza.png';
import tacos from './images/tacos.png';
import pie from './images/pie.png';
import pasta from './images/Pasta.png'
import Reviews from './Reviews';

const sections = [
  {
    title: "Welcome to Fork and Feast",
    text: "Your perfect dining experience awaits!",
    img: pizza,
    imgLeft: false,
  },
  {
    title: "Why Choose Fork and Feast?",
    text: "At Fork and Feast, we believe that dining out should be a delightful experience from start to finish. Our platform connects customers with restaurants seamlessly, making reservations easy and enjoyable.",
    img: tacos,
    imgLeft: true,
  },
  {
    title: "For Restaurant Owners",
    text: (
      <ul style={{ textAlign: 'left', padding: '0 20px' }}>
        <li>Manage Reservations Effortlessly</li>
        <li>Increase Visibility</li>
        <li>Exclusive Promotions</li>
        <li>Data Insights</li>
      </ul>
    ),
    img: pie,
    imgLeft: false,
  },
  {
    title: "For Diners",
    text: (
      <ul style={{ textAlign: 'left', padding: '0 20px' }}>
        <li>Effortless Reservations</li>
        <li>Personalized Recommendations</li>
        <li>Explore Menus and Reviews</li>
        <li>Loyalty Rewards and Offers</li>
      </ul>
    ),
    img:pasta,
    imgLeft: true,
  },
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="content">
        {sections.map((section, index) => (
          <div key={index} className={`section ${section.imgLeft ? 'img-left' : 'img-right'}`}>
            <div className="text-card">
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
            <div className="image-container">
              <img src={section.img} alt={section.title} />
            </div>
          </div>
        ))}
        <Reviews />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
