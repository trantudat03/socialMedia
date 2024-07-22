import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { TextInput, Loading, CustomButton } from "../index";

import axios from "axios";
import { ShopContext } from "../../Context/ShopContext";
import { NoProfile } from "../../assets";

const EditProfile = ({ user, onUpdateClick }) => {
  //   const { user } = useSelector((state) => state.user);
  const { setUser } = useContext(ShopContext);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);
  const [avatar, setAvatar] = useState(user?.profileUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: { ...user } });
  //   console.log(user);
  const onSubmit = async (data) => {
    try {
      if (data.firstName && data.location && data.profession && data.lastName) {
        axios
          .post("/updateProfile", {
            firstName: data.firstName,
            lastName: data.lastName,
            location: data.location,
            profession: data.profession,
            profileUrl: avatar || "",
          })
          .then((response) => {
            setUser(response.data);
            alert("Update Profile successful");
            onUpdateClick();
          })
          .catch((e) => {
            alert("Update Fail");
          });
      } else {
        alert("fail");
      }
    } catch (e) {
      alert("Update fail by server");
    }
  };
  const handleSelect = (e) => {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAvatar(filenames[0]);
      });
  };

  return (
    <div className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-[#000] opacity-70"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className="inline-block align-bottom bg-white rounded-1g text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between px-6 pt-5 pb-2">
            <label
              htmlFor="name"
              className="block font-medium text-xl text-ascent-1 text-left"
            >
              Cập nhật thông tin
            </label>

            <button className="text-ascent-1" onClick={onUpdateClick}>
              <MdClose size={22} />
            </button>
          </div>
          <form
            className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              label="Tên"
              placeholder="First Name"
              type="text"
              styles="w-full"
              register={register("firstName", {
                required: "First Name is required!",
              })}
              error={errors.firstName ? errors.firstName?.message : ""}
            />
            <TextInput
              label="Họ"
              placeholder="Họ..."
              type="lastName"
              styles="w-full"
              register={register("lastName", {
                required: "Last Name do no match!",
              })}
              error={errors.lastName ? errors.lastName?.message : ""}
            />
            <TextInput
              name="profession"
              label="Nghề nghiệp"
              placeholder="Nghề nghiệp..."
              type="profession"
              styles="w-full"
              register={register("profession", {
                required: "Profession is required!",
              })}
              error={errors.profession ? errors.profession?.message : ""}
            />
            <TextInput
              label="Địa chỉ"
              placeholder="Địa chỉ..."
              type="location"
              styles="w-full"
              register={register("location", {
                required: "Location  do no match!",
              })}
              error={errors.location ? errors.location?.message : ""}
            />
            {/* <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4 "
                htmlFor="imgUpload"
              >
                 */}
            <label className="text-ascent-2 text-sm mb-2">Ảnh đại diện</label>
            <div>
              <div className="w-12 h-12">
                <img
                  className="w-full h-full object-cover "
                  src={
                    avatar
                      ? `http://localhost:4000/uploads/${avatar}`
                      : NoProfile
                  }
                  alt="Profile"
                />
              </div>

              <input
                type="file"
                className="file-input hidden"
                id="avtUpload"
                onChange={handleSelect}
                accept=".jpg, .png, .jpeg"
              />
              <label
                htmlFor="avtUpload"
                className="inline-block bg-gray-300 hover:bg-white text-black font-bold py-1 px-3 rounded cursor-pointer mt-2"
              >
                Chọn ảnh
              </label>
            </div>
            {/* </label> */}
            {errMsg?.message && (
              <span
                role="alert"
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}
            <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  containerStyles={`inline-flex justify-center rounded-md bg-blue-500 px-8 py-3 text-sm font-medium text-white outline-none`}
                  title="Submit"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
