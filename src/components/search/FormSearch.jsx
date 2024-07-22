import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
const FormSearch = ({ text }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: text?.text || "", // Thiết lập giá trị mặc định cho trường 'search'
    },
  });

  const handleSearch = async (data) => {
    // console.log(data);
    if (data && data.search) {
      navigate(`/search?q=${data.search}`);
    }
  };
  return (
    <>
      <form className="w-full relative " onSubmit={handleSubmit(handleSearch)}>
        <input
          placeholder="Tìm kiếm..."
          className="outline-none py-2 px-3 pl-10 rounded-full text-base min-w-72 w-full text-[#333] focus:bg-gray-200"
          {...register("search")} // Sử dụng cú pháp spread để kết nối input với register
          name="search"
        />
        {/* <button type="submit">Tim</button> */}
        <div className="absolute top-1 left-2 text-3xl text-gray-500">
          <IoIosSearch />
        </div>
      </form>
    </>
  );
};

export default FormSearch;
