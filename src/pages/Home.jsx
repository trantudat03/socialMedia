import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  TopBar,
  ProfileCard,
  FriendsCard,
  CustomButton,
  TextInput,
  Loading,
  PostCart,
  EditProfile,
} from "../components";
// import { friends, requests, suggest, posts } from "../assets/data";
import { NoProfile } from "../assets";
import { Link, Navigate } from "react-router-dom";
import { BsPersonFillAdd, BsFiletypeGif } from "react-icons/bs";
import { BiSolidVideo, BiImages } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { ShopContext } from "../Context/ShopContext";
import FriendRequest from "../components/FriendRequest";
import axios from "axios";
import ListPosts from "../components/ListPosts";
import ChallengeList from "../components/ChallengeList";

const Home = () => {
  //   const { user, edit } = useSelector((state) => state.user);
  const { user } = useContext(ShopContext);

  //   const [friendRequest, setFriendRequest] = useState(requests);
  //   const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const [errMsg, setErrMsg] = useState("");
  const [postList, setPostList] = useState([]);
  const [posting, setPosting] = useState(false);
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, // Corrected from fromState to formState
  } = useForm();
  //   console.log(file);
  const handlePostSubmit = async (data) => {
    console.log(data.description);
    if (data.description) {
      axios
        .post("/createPost", {
          description: data.description,
          image: image,
        })
        .then((res) => {
          alert("Đăng bài thành công");
          reset();
          setImage("");
        })
        .catch(() => {
          alert("Đăng bài thất bại");
        });
    }
  };

  useEffect(() => {
    axios
      .get("/getPosts", { search: "" })
      .then((res) => {
        // console.log(res.data.data);
        setPostList(res.data.data);
      })
      .catch(() => {
        // alert("Lỗi khi lấy bài viết");
        console.log("get posts Error");
      });
  }, []);

  //   console.log(postList);

  const handShowUpdateProfile = () => {
    if (!editProfile) {
      setEditProfile(true);
    } else {
      setEditProfile(false);
    }
  };
  if (!user) {
    return <Navigate to={"/login"} />;
  }

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
  //   console.log(image);
  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb:20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar text={""} />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* Left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} onUpdateClick={handShowUpdateProfile} />
            <FriendsCard user={user} />
            <div className="mb-10"></div>
          </div>

          {/* Center */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-center gap-2 py-4 ">
                <img
                  src={NoProfile}
                  alt="UserImage"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <TextInput
                  styles="w-full rounded-full py-5"
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

              <div className="flex items-center justify-between py-4">
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

            <ListPosts list={postList} user={user} />
          </div>
          {/* Right */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* Friend Request */}
            <FriendRequest user={user} />
            <ChallengeList user={user} />
            {/* SUGGESTED Friends */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645">
                <span>Đề xuất kết bạn</span>
              </div>

              {/* <div className="w-full flex flex-col gap-4 py-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />

                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => {}}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {editProfile && (
        <EditProfile user={user} onUpdateClick={handShowUpdateProfile} />
      )}
    </>
  );
};
export default Home;
