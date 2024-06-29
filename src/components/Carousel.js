import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css"; // You can add custom styles here

import CountdownTimer from "./CountdownTimer";

const Carousel = ({ images, fecha }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  return (
    <div className="carousel-container">
      <div className="contanier-counter">
        <CountdownTimer fecha={fecha} />
      </div>

      <Slider {...settings}>
        {images.map((url, index) => (
          <div key={index} className="carousel-slide">
            <img src={url} className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
