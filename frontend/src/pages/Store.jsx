import React from "react";
import ListStore from "../components/ListStore";
import { assets } from "../assets/assets";

export const Store = () => {
  return (
    <section className="max-w-screen-2xl mx-auto">
      <div className="px-2 xl:px-20 text-gray-600 text-sm">
        <section className="flex items-center relative min-h-72">
          <img
            className="w-full xl:h-auto h-72 object-cover opacity-50" // Set object-cover for better image fitting
            src={assets.hero_store1} // Correctly reference the image from the assets object
            alt="Background"
          />
          <div className="absolute text-center w-full left-0">
            <div className="text-gray-800 mt-6 mb-6 xl:mb-16">
              <h1 className="text-3xl font-bold leading-tight">HỆ THỐNG CỬA HÀNG</h1>
              <p className="font-semibold">Bạn cần hỗ trợ? Gọi miễn phí 1800 6061</p>
            </div>
            <div className="xl:flex items-center justify-center w-full">
              <input
                placeholder="Vui lòng nhập tên Quận/Huyện hoặc Tỉnh/TP..."
                name="fname"
                className="xl:w-6/12 w-10/12 h-10 pl-3 border-2 border-gray-400 outline-none bg-white rounded-lg shadow-sm focus:border-red-500 transition duration-200" // Adjust height and add border/transition effects
              />
              <button className="xl:w-2/12 w-4/12 mt-2 xl:mt-0 border-2 border-red-500 px-4 h-10 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-200 ml-1.5">
                TÌM KIẾM
              </button>
            </div>
            <button className="px-4 h-10 text-gray-700 bg-gray-200 mt-2 xl:mt-9 rounded-lg hover:bg-gray-300 transition duration-200">
              HOẶC XEM TẤT CẢ 110 CỬA HÀNG
            </button>
          </div>
        </section>

        <section className="space-y-7 mb-20">
          <h1 className="text-2xl font-bold text-gray-800 mt-14">
            DANH SÁCH CỬA HÀNG THỜI TRANG CANIFA
          </h1>
          <ListStore />
        </section>
        <p className="w-full border-b border-gray-300"></p>
      </div>
    </section>
  );
};
