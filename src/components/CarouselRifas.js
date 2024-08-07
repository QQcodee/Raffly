// Carousel.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RifaList from "./RifaList";

const CarouselRifas = ({ items }) => {
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 3, // Number of items to show at once
    slidesToScroll: 1,
    autoplay: true,
    centerMode: true,
    centerPadding: "0px",

    responsive: [
      {
        breakpoint: 1328,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          centerMode: true,
          centerPadding: "7px",
        },
      },
      {
        breakpoint: 885,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          centerMode: true,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          centerMode: true,
          centerPadding: "7px",
        },
      },
    ],
  };

  return (
    <div style={{ marginBottom: "60px" }}>
      <Slider {...settings}>
        {items.map((item, index) => (
          <RifaList key={index} rifa={item} />
        ))}
      </Slider>
    </div>
  );
};

export default CarouselRifas;
