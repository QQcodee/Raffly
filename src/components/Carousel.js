// src/Carousel.js

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css'; // You can add custom styles here


const Carousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((url, index) => (
          <div key={index} className="carousel-slide">
            <img src={url} alt={`Slide ${index}`} className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
