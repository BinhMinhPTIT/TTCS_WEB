const NewsLetterBox = () => {
  const onSubmitHandler = () => {
    event.preventDefault();
    
  };
  return (
    <div className="text-center mt-10">
      <p className="text-2xl font-medium text-gray-800">
      Đăng ký nhận bản tin
      </p>
      <p className="text-gray-400 mt-3">
      Cùng Canifa Blog cập nhật những thông tin mới nhất về thời trang và phong cách sống.
      </p>
      <form
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
        onSubmit={onSubmitHandler}
      >
        <input
          type="email"
          placeholder="Enter Your Email."
          className="w-full sm:flex-1 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-sm px-10 py-4"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
