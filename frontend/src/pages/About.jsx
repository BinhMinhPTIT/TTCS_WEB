import React from "react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsletterBox";
import { assets } from "../assets/assets";
const About = () => {
  return (
    <div className="max-w-9xl mx-auto">
      <div className="mb-8">
        <img
          src="https://admin.canifa.com/media/wysiwyg/CNF00135-_1_.jpg"
          alt="Canifa"
          className="mb-6 w-full rounded-md object-cover"
          style={{ height: "500px" }}
        />
        <p className="text-center text-lg font-medium">Canifa - Khoác lên niềm vui gia đình Việt</p>
      </div>

      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">

        <div className="flex flex-col justify-center gap-6  text-gray-600">
          <p className="">
            {`

Canifa 20 năm - Khoác lên niềm vui gia đình Việt

Năm 1997, Công ty Cổ phần Thương mại và Dịch vụ Hoàng Dương được thành lập với mục đích chính ban đầu là hoạt động trong lĩnh vực sản xuất hàng thời trang xuất khẩu với các sản phẩm chủ yếu làm từ len và sợi.

Năm 2001 thương hiệu thời trang CANIFA ra đời, tự hào trở thành một cột mốc đáng nhớ của doanh nghiệp Việt trong ngành thời trang.`}
          </p>
          <p className="">
            {` 
Tầm nhìn và sứ mệnh

Mang đến niềm vui cho hàng triệu gia đình Việt

Canifa hướng đến mục tiêu mang lại niềm vui mặc mới mỗi ngày cho hàng triệu người tiêu dùng Việt. Chúng tôi tin rằng người dân Việt Nam cũng đang hướng đến một cuộc sống năng động, tích cực hơn.
`}
          </p>
          <p>
            {`Giá trị cốt lõi của Canifa

20 năm phát triển - Chúng tôi luôn tuân thủ những giá trị cốt lõi của mình.
Kinh doanh dựa trên giá trị thật:

CANIFA thiết lập hệ thống tiêu chuẩn chất lượng quốc tế áp dụng trên tất cả quy trình quản lý và kiểm soát chất lượng từ khâu chọn lọc nguyên phụ liệu cho đến khâu thiết kế và sản xuất (Oeko-tex, Cotton USA, Woolmark,...).`}
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 sm:py-8 flex flex-col gap-5">
          <strong>Quality Assurance:</strong>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className="border px-10 md:px-16 sm:py-8 flex flex-col gap-5">
          <strong>Convenience:</strong>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 sm:py-8 flex flex-col gap-5">
          <strong>Exceptional Customer Service:</strong>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>
      <NewsLetterBox />
    </div>

  );
};

export default About;