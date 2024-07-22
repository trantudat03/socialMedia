import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"; // Assuming you are using react-router
import { TbBrandDatabricks } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, CustomButton, FormSearch } from "../index";

import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../../redux/theme";
import axios from "axios";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { LogOut, Profile, reset } from "../../redux/authSlice";
import { LuHome } from "react-icons/lu";
import { BsShop } from "react-icons/bs";
import { LiaTrophySolid } from "react-icons/lia";
import { GrGroup } from "react-icons/gr";

const TopBar = ({ text }) => {
  const location = useLocation();
  const [pageFocus, setPageFocus] = useState("");
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { user, isSuccess, isError } = useSelector((state) => state.auth);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };
  useEffect(() => {
    if (location?.pathname) {
      const path = location?.pathname;
      //   console.log(path);
      if (path === "/") {
        setPageFocus("home");
      } else {
        setPageFocus("none");
      }
    }
  }, [location]);
  function handLogout() {
    dispatch(LogOut());
    dispatch(reset());
  }

  return (
    <div className=" left-0 w-full flex items-center justify-center py-2 px-4 shadow-lg bg-white">
      <Tooltip id="topBarTt" />
      <div className="absolute left-2 flex items-center gap-2 ">
        <Link to="/" className=" items-center text-center">
          <div className=" rounded text-[#065ad8] text-center items-center ">
            <TbBrandDatabricks className="text-5xl items-center text-center" />
          </div>
        </Link>
        <FormSearch text={""} />
      </div>

      <div className="flex  justify-center items-center gap-16 ">
        <Link
          to="/"
          data-tooltip-id="topBarTt"
          data-tooltip-content="Trang chủ"
          className={`p-0 ${
            pageFocus === "home" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <LuHome size={38} className="p-0" />
        </Link>
        <Link
          to="/"
          data-tooltip-id="topBarTt"
          data-tooltip-content="Sàn thương mại"
          className={`p-0 ${
            pageFocus === "shop" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <BsShop strokeWidth={0.1} size={36} className="p-0" />
        </Link>
        <Link
          to="/"
          data-tooltip-id="topBarTt"
          data-tooltip-content="Giải đấu"
          className={`p-0 ${
            pageFocus === "trophy" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <LiaTrophySolid strokeWidth={0.1} size={41} className="p-0" />
        </Link>
        <Link
          to="/"
          data-tooltip-id="topBarTt"
          data-tooltip-content="Nhóm"
          className={`p-0 ${
            pageFocus === "group" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <GrGroup strokeWidth={0.1} size={35} className="p-0" />
        </Link>
      </div>

      {/* Icon */}
      <div className="absolute right-2 flex gap-4 items-center text-ascent-1 text-md md:text-xl ">
        <Link
          to={"/chat"}
          className="hidden lg:flex cursor-pointer"
          data-tooltip-id="topBarTt"
          data-tooltip-content="Chat"
        >
          <IoChatbubbleEllipsesOutline />
        </Link>
        <button
          onClick={() => handleTheme()}
          data-tooltip-id="topBarTt"
          data-tooltip-content="Sáng tối"
        >
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div
          className="hidden lg:flex cursor-pointer"
          data-tooltip-id="topBarTt"
          data-tooltip-content="Thông báo"
        >
          <IoMdNotificationsOutline />
        </div>

        <div>
          <CustomButton
            onClick={handLogout}
            title="Đăng xuất"
            containerStyles="text-sm text-ascent-1 px-4 md:px-4 py-1 md:py-1 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
