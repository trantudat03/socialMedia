import React, { useContext, useEffect } from "react";
import { TopBar } from "../../components";
import LeftSidebar from "../../components/layout/LeftSidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import RightSidebar from "../../components/layout/RightSidebar";
import { ShopContext } from "../../Context/ShopContext";
import { useDispatch, useSelector } from "react-redux";
import { Profile, reset } from "../../redux/authSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const { isError, user, isSuccess } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(Profile());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    } else {
      if (isSuccess && !user) {
        navigate("/login");
      }
    }
    // dispatch(reset());
  }, [isError, isSuccess]);

  return (
    <div className="relative">
      <div className="sticky top-0">
        <TopBar text={""} />
      </div>
      <div className="w-full px-0 bg-[#f0f2f5]">
        {/* <div className=""> */}
        <Outlet />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Layout;
