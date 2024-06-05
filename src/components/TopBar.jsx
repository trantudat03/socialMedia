import React, { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"; // Assuming you are using react-router
import { TbSocial, TbBrandDatabricks } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
const TopBar = ({ text }) => {
  const { theme } = useSelector((state) => state.theme);
  //   const { user } = useSelector((state) => state.user);
  const { user, setUser } = useContext(ShopContext);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: text.text || "", // Thiết lập giá trị mặc định cho trường 'search'
    },
  });

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const navigate = useNavigate();

  const handleSearch = async (data) => {
    if (data && data.search) {
      navigate(`/search/${data.search}`);
    }
  };

  function handLogout() {
    axios
      .post("/logout")
      .then((response) => {
        setUser(null);
        alert("Logout success");
      })
      .catch((e) => {
        alert("Logout fail");
      });
  }

  if (user === null) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary relative">
      <Link to="/" className=" items-center text-center absolute">
        <div className=" rounded text-[#065ad8] text-center items-center ">
          <TbBrandDatabricks className="text-6xl items-center text-center" />
        </div>
        <span className="text-xs md:text-xs text-[#065ad8] font-semibold ">
          Mạng Xã Hội Billiards
        </span>
      </Link>
      <div className="w-20 "></div>

      <form
        className="hidden md:flex items-center justify-between "
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder="Tìm kiếm..."
          styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
          register={register("search")}
        />
        <CustomButton
          title={`Tìm`}
          type="submit"
          containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
        />
      </form>

      {/* Icon */}
      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className="hidden lg:flex cursor-pointer">
          <IoMdNotificationsOutline />
        </div>

        <div>
          <CustomButton
            onClick={handLogout}
            title="Đăng xuất"
            containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
