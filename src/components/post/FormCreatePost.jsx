import React, { useEffect, useState } from "react";
import { BsFiletypeGif } from "react-icons/bs";
import CustomButton from "../button/CustomButton";
import Loading from "../card/Loading";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import axios from "axios";
import TextInput from "../input/TextInput";
import { NoProfile } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { CreatePost, reset as resetPosts } from "../../redux/postSlice";

const FormCreatePost = ({ user }) => {
  const [posting, setPosting] = useState(false);
  const [loading, setloading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const { posts, isNewPost, isSuccess, isError } = useSelector(
    (state) => state.post
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, // Corrected from fromState to formState
  } = useForm();

  const handlePostSubmit = async (data) => {
    console.log(data.description);
    if (data.description) {
      //   axios
      //     .post("/createPost", {
      //       description: data.description,
      //       image: image,
      //     })
      //     .then((res) => {
      //       alert("Đăng bài thành công");
      //       reset();
      //       setImage("");
      //       //   setPostList([res.data.data, ...postList]);
      //     })
      //     .catch(() => {
      //       alert("Đăng bài thất bại");
      //     });
      const payload = {
        description: data.description,
        image: image,
      };
      //   console.log(payload);
      dispatch(CreatePost(payload));
      reset();
      setImage("");
    }
  };

  //   useEffect(() => {
  //     if (isNewPost) {
  //       if (isError) {
  //         alert("dang bai that bai");
  //         dispatch(resetPosts());
  //       } else {
  //         if (isSuccess) {
  //           alert("dang bai Thanh cong");
  //           dispatch(resetPosts());
  //         }
  //       }
  //     }
  //   }, [posts, isNewPost]);
  function uploadPhoto(ev) {
    const files = ev.target.files;
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
        setImage(filenames[0]);
      });
  }
  return (
    <form
      onSubmit={handleSubmit(handlePostSubmit)}
      className="bg-primary px-4 rounded-lg flex-shrink-0"
    >
      <div className="w-full flex items-center gap-2 py-2 ">
        <img
          src={
            user.profileUrl
              ? `http://localhost:4000/uploads/${user.profileUrl}`
              : NoProfile
          }
          alt="UserImage"
          className="w-14 h-14 rounded-full object-cover"
        />
        <TextInput
          styles="w-full rounded-full py-3"
          placeholder="Bạn đang nghĩ gì..."
          name="description"
          register={register("description", {
            required: "Viết bất cứ gì!",
          })}
          error={errors.description ? errors.description.message : ""}
        />
      </div>

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
      {image !== "" && (
        <div className="flex-1 px-4 flex flex-col gap-6 rounded-lg border-b border-[#66666645] mb-1 pb-3">
          <div className="relative  items-center flex justify-center gap-1  bg-transparent rounded-xl  h-20 w-20">
            <div
              onClick={() => {
                setImage("");
              }}
              className="cursor-pointer absolute left-1 top-1 text-red text-xl bg-red rounded-2xl "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <img
              className="w-full h-full object-cover rounded-xl border-[#66666645] border"
              src={`http://localhost:4000/uploads/${image}`}
              alt=""
            />
          </div>
        </div>
      )}
      {image === "" && (
        <div className="flex-1 px-4 flex flex-col gap-6 rounded-lg border-b border-[#66666645] mb-1 pb-3"></div>
      )}

      <div className="flex items-center justify-between py-2">
        <label
          htmlFor="imgUpload"
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer "
        >
          <input
            type="file"
            onChange={uploadPhoto}
            className="hidden"
            id="imgUpload"
            data-max-size="5120"
            accept=".jpg, .png, .jpeg"
          />
          <BiImages />
          <span>Ảnh</span>
        </label>

        <label
          htmlFor="videoUpload"
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer "
        >
          <input
            type="file"
            onChange={uploadPhoto}
            className="hidden"
            id="videoUpload"
            data-max-size="5120"
            accept=".mp4, .wav"
          />
          <BiSolidVideo />
          <span>Video</span>
        </label>

        <label
          htmlFor="vgifUpload"
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer "
        >
          <input
            type="file"
            onChange={uploadPhoto}
            className="hidden"
            id="vgifUpload"
            data-max-size="5120"
            accept=".gif "
          />
          <BsFiletypeGif />
          <span>Gif</span>
        </label>

        <div>
          {posting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              containerStyles={`bg-[#0444a4] text-white py-1 px-6 rounded-full text-sm`}
              title="Đăng"
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default FormCreatePost;
