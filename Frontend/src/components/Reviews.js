import React from 'react';
import Slider from 'react-slick';
import './Reviews.css';

const reviews = [
  {
    name: "Alice Johnson",
    review: "The food was amazing! I loved the ambiance and the staff was very friendly.",
  },
  {
    name: "John Smith",
    review: "An excellent dining experience! The menu had a great variety and everything we ordered was delicious.",
  },
  {
    name: "Sarah Williams",
    review: "Highly recommend! The desserts were to die for, and the service was top-notch.",
  },
  {
    name: "Michael Brown",
    review: "A hidden gem! I will definitely be coming back for more.",
  },
  {
    name: "Emily Davis",
    review: "Best restaurant in town! Every dish was prepared perfectly.",
  },
];

const Reviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 1000, // Time between slides (in milliseconds)
  };

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <p>{`"${review.review}"`}</p>
            <h4>- {review.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Reviews;
