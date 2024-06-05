import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TbBrandDatabricks, TbSocial } from "react-icons/tb";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { TextInput, Loading, CustomButton } from "../components";
import { BgImage } from "../assets";
import axios from "axios";
const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      if (data.firstName && data.email && data.password && data.lastName) {
        axios
          .post("/signup", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
          })
          .then((response) => {
            alert("signup successful. Now you can log in");
          })
          .catch((e) => {
            alert("signup failed. Please try again later");
          });
      } else {
        alert("fail");
      }
    } catch (e) {
      alert("signup failed. Please try again later");
    }
  };

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary roundel-xl overflow-hidden shadow-xl">
        {/* {LEFT} */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <Link to="/" className=" items-center text-center ">
              <div className=" rounded text-[#065ad8] text-center items-center ">
                <TbBrandDatabricks className="text-6xl items-center text-center" />
              </div>
              <span className="text-xs md:text-xs text-[#065ad8] font-semibold ">
                Mạng Xã Hội Billiards
              </span>
            </Link>
          </div>
          <p className="text-ascent-1 text-base font-semibold">
            Tạo Tài Khoản Mới
          </p>

          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="firstName"
                placeholder="Tên..."
                label="Tên"
                type="text"
                register={register("firstName", {
                  required: "First Name is required",
                })}
                styles="w-full"
                error={errors.firstName ? errors.firstName?.message : ""}
              />
              <TextInput
                placeholder="Họ..."
                label="Họ"
                type="lastName"
                register={register("lastName", {
                  required: "Last Name do no match",
                })}
                styles="w-full"
                error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>
            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email"
              type="email"
              register={register("email", {
                required: "Email Address is required",
              })}
              styles="w-full"
              error={errors.email ? errors.email.message : ""}
            />
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="password"
                label="Mật khẩu"
                placeholder="Mật khẩu..."
                type="password"
                styles="w-full"
                register={register("password", {
                  required: "Password is required",
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              <TextInput
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu..."
                type="password"
                styles="w-full"
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();
                    if (password !== value) {
                      return "Password do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

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
                title="Tạo tài khoản"
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Đăng nhập
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
              Thách đấu với những người xung quanh bạn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
