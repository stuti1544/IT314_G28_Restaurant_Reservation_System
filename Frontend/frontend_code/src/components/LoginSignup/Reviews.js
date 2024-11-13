import React from 'react';
import Slider from 'react-slick';
import './Reviews.css';

const reviews = [
  {
    name: "Alice Johnson",
    review: "Booking a table was so easy! The restaurant's ambiance matched exactly what I was looking for. Highly recommended.",
    image: "/path/to/alice.jpg", // Add path to circular image
  },
  {
    name: "John Smith",
    review: "Fantastic experience! The reservation system was quick, and I even got a birthday discount!",
    image: "/path/to/john.jpg",
  },
  {
    name: "Sarah Williams",
    review: "Loved the simplicity of the booking process. Got instant confirmation and the table was ready when I arrived.",
    image: "/path/to/sarah.jpg",
  },
  {
    name: "Michael Brown",
    review: "Effortless reservations! I could see real-time availability, which saved us so much time.",
    image: "/path/to/michael.jpg",
  },
  {
    name: "Emily Davis",
    review: "Amazing service! Easy booking and the reminder notifications were very helpful.",
    image: "/path/to/emily.jpg",
  },
];

const Reviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <img src={review.image} alt={review.name} className="review-image" />
            <p>{`"${review.review}"`}</p>
            <h4>- {review.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Reviews;
