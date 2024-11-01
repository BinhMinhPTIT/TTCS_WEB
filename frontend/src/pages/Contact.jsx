import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={assets.contact_img}
          alt="Contact Image"
          className="w-full md:max-w-[480px]"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Về chúng tôi</p>
          <p className="text-gray-500">
          Số 688 Đường Quang Trung, <br />
          Phường La Khê, Quận Hà Đông, Thành phố Hà Nội
          </p>
          <p className="text-gray-500">
            Tel: +12-34567-89012 <br /> Email: hello@canifa.com
          </p>


        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
