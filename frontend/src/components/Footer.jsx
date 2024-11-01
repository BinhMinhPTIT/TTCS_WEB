import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="">
      <div className="fle flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Mang đến niềm vui cho hàng triệu gia đình Việt

            Canifa hướng đến mục tiêu mang lại niềm vui mặc mới mỗi ngày cho hàng triệu người tiêu dùng Việt. Chúng tôi tin rằng người dân Việt Nam cũng đang hướng đến một cuộc sống năng động, tích cực hơn.

            Giá trị cốt lõi của Canifa
            20 năm phát triển - Chúng tôi luôn tuân thủ những giá trị cốt lõi của mình.

            Kinh doanh dựa trên giá trị thật:
            CANIFA thiết lập hệ thống tiêu chuẩn chất lượng quốc tế áp dụng trên tất cả quy trình quản lý và kiểm soát chất lượng từ khâu chọn lọc nguyên phụ liệu cho đến khâu thiết kế và sản xuất (Oeko-tex, Cotton USA, Woolmark,...).
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">Thương hiệu</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">CÔNG TY CỔ PHẦN CANIFA</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><strong>Số ĐKKD:</strong> 0107574310</li>
            <li><strong>Ngày cấp:</strong> 23/09/2016</li>
            <li><strong>Nơi cấp:</strong> Sở Kế hoạch và đầu tư Hà Nội</li>
            <li><strong>Địa chỉ trụ sở:</strong> Số 688 Đường Quang Trung, Phường La Khê, Quận Hà Đông, Thành phố Hà Nội</li>
            <li><strong>Địa chỉ liên hệ:</strong> P301, tầng 3, tòa nhà GP Invest, số 170 La Thành, Phường Ô Chợ Dừa, Quận Đống Đa, Thành phố Hà Nội</li>
            <li><strong>Điện thoại:</strong> +8424 - 7303.0222</li>
            <li><strong>Fax:</strong> +8424 - 6277.6419</li>
            <li><strong>Email:</strong> <a href="mailto:hello@canifa.com">hello@canifa.com</a></li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          © 2023 CANIFA
        </p>
      </div>
    </div>
  );
};

export default Footer;
