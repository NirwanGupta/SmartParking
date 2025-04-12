import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaParking } from "react-icons/fa";
import { Car } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // const images = [
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s",
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9vqsNguiamsOXCxZWBcGRFCXXmFN-LR5p6g&s",
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf6zoRR_FPG7f2knECoYTgOuETejMYPg71vg&s",
  //   "https://static.vecteezy.com/system/resources/thumbnails/024/061/511/small_2x/serene-portrait-of-lord-krishna-the-god-of-love-and-compassion-ai-generated-free-photo.jpg",
  //   "https://img.freepik.com/free-photo/young-woman-with-blond-hair-long-hair-looking-camera-smiling-outdoors-generated-by-artificial-intelligence_188544-127215.jpg",
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s",
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9vqsNguiamsOXCxZWBcGRFCXXmFN-LR5p6g&s",
  // ];

  const navigate = useNavigate();
  const { selectedBuildingId } = useAuthStore();
  console.log(selectedBuildingId);

  const {getImagesForHomeCarousel, images} = useAuthStore();
  useEffect(() => {
    getImagesForHomeCarousel();
  },[]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-authImagePattern text-authPrimary overflow-hidden">
      {/* Background Blocks */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 gap-3 p-4 md:p-8">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-2xl bg-primary/10 ${i % 2 === 0 ? "animate-pulse" : "opacity-50"}`}
          />
        ))}
      </div>

      {/* Header with Icon */}
      <div className="relative flex items-center space-x-3 mb-6 z-10">
        <Car className="text-7xl text-primary drop-shadow-lg w-12 h-12" />
        <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg text-authPrimary">FindMySpot</h1>
      </div>

      {/* Subtitle */}
      <h2 className="text-lg md:text-2xl font-semibold text-authSecondary mb-4">
        Smart Parking System - Future of Online Parking
      </h2>
      <p className="text-base md:text-lg text-authSecondaryLight max-w-lg text-center mb-6">
        Effortless parking solutions at your fingertips. Reserve, Navigate, Park!
      </p>

      {/* Carousel */}
      <div className="relative w-4/5 mx-auto mt-4 md:mt-8 z-10">
        <div className="absolute inset-0 bg-authSecondaryDark/70 rounded-lg shadow-xl"></div>
        <div className="relative p-4">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index} className="px-2">
                <img
                  src={image}
                  alt={`Parking Spot ${index + 1}`}
                  className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-lg shadow-lg border-2 border-authSecondary/30"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* get the nearest parking near you */}
      <div className="mt-8 text-center z-10">
        <h3 className="text-lg md:text-xl font-semibold text-authSecondary">
          Want to book your parking slot? Get your nearest parking slot now!
        </h3>
        <button className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/80 transition" onClick={() => navigate('/map')}>
          Find Parking
        </button>
      </div>
    </div>
  );
};

export default HomePage;
