import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { TbBrandDatabricks, TbSocial } from "react-icons/tb";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { TextInput, Loading, CustomButton } from "../../components/index";
import { BgImage } from "../../assets";
import { LoginUser, Profile, reset } from "../../redux/authSlice";
const Login = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(Profile());
  }, []);

  const onSubmit = async (data) => {
    if (data.email && data.password) {
      const payload = {
        email: data.email,
        password: data.password,
      };
      dispatch(LoginUser(payload));
    } else {
      alert("Please enter all fields");
    }
  };

  useEffect(() => {
    if (user && isSuccess) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isSuccess]);

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary roundel-xl overflow-hidden shadow-xl">
        {/* {LEFT} */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <Link to="/" className=" items-center text-center">
              <div className=" rounded text-[#065ad8] text-center items-center ">
                <TbBrandDatabricks className="text-6xl items-center text-center" />
              </div>
              <span className="text-xs md:text-xs text-[#065ad8] font-semibold ">
                Mạng Xã Hội Billiards
              </span>
            </Link>
          </div>
          <h2 className="text-ascent-1 text-base font-semibold">Đăng nhập</h2>
          <span className="text-sm mt-2 text-ascent-2">
            Chào mừng bạn quay lại
          </span>

          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email"
              type="email"
              register={register("email", {
                required: "Email Address is required",
              })}
              styles="w-full rounded-full"
              labelStyle="ml-2"
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name="password"
              label="Mật khẩu"
              placeholder="mật khẩu..."
              type="password"
              styles="w-full rounded-full"
              labelStyle="ml-2"
              register={register("password", {
                required: "Password is required",
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <Link
              to="/reset-password"
              className="text-sm text-right text-blue font-semibold"
            >
              Quên mật khẩu?
            </Link>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title="Đăng nhập"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Tạo tài khoản
            </Link>
          </p>
        </div>
        {/* {RIGHT} */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="BgImage"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />

            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Chia sẻ</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Kết nối</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Tương tác</span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Kết nối với bạn bè và chia sẻ niềm vui
            </p>
            <span className="text-sm text-white/80">
              Thách đầu với mọi người xung quanh bạn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
