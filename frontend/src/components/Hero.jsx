import { assets } from "../assets/assets";
import { useState, useEffect } from "react";

const Hero = () => {
  // Array of hero images for the slideshow
  const images = [assets.canifa1, assets.canifa2, assets.canifa3, assets.canifa4];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slide Show Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full flex-shrink-0"
          />
        ))}
      </div>

      {/* <button
        onClick={prevSlide}
        className="absolute left-2 top-1/4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
      >
        &#9664;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
      >
        &#9654;
      </button> */}

      {/* Services Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 px-4">
        {/* Payment on Delivery */}
        <div className="service-item flex flex-col items-center p-6 rounded-lg ">
          <img
            src="https://media.canifa.com/Simiconnector/Service/s/e/service1.png"
            alt="Payment on Delivery"
            className="mb-4 w-16 h-16"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Thanh toán khi nhận hàng (COD)</h3>
          <p className="text-gray-600 text-sm">Giao hàng toàn quốc.</p>
        </div>

        {/* Free Shipping */}
        <div className="service-item flex flex-col items-center p-6  rounded-lg ">
          <img
            src="https://media.canifa.com/Simiconnector/Service/s/e/service2.png"
            alt="Free Shipping"
            className="mb-4 w-16 h-16"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Miễn phí giao hàng</h3>
          <p className="text-gray-600 text-sm">Với đơn hàng trên 599.000đ.</p>
        </div>

        {/* Free Exchange */}
        <div className="service-item flex flex-col items-center p-6  rounded-lg ">
          <img
            src="https://media.canifa.com/Simiconnector/Service/s/e/service3.png"
            alt="Free Exchange"
            className="mb-4 w-16 h-16"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Đổi hàng miễn phí</h3>
          <p className="text-gray-600 text-sm">Trong 30 ngày kể từ ngày mua.</p>
        </div>
      </div>

    </div>
  );
};

export default Hero;