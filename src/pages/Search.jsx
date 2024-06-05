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
import { Link, Navigate, useParams } from "react-router-dom";
import { BsPersonFillAdd, BsFiletypeGif } from "react-icons/bs";
import { BiSolidVideo, BiImages } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";

const Search = () => {
  //   const { user, edit } = useSelector((state) => state.user);
  const { user } = useContext(ShopContext);
  const text = useParams();
  const [users, setUsers] = useState([]);
  //  const [friendRequest, setFriendRequest] = useState(requests);
  //   const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setloading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }, // Corrected from fromState to formState
  } = useForm();

  const handSearch = () => {
    axios.post("/findUserByName", { text: text.text }).then((response) => {
      console.log(response.data);
      setUsers(response.data);
    });
  };

  useEffect(() => {
    if (text.text) {
      handSearch();
    }
  }, [text.text]);

  const handShowUpdateProfile = () => {
    if (!editProfile) {
      setEditProfile(true);
    } else {
      setEditProfile(false);
    }
  };

  const handFriendRequest = (u) => {
    // console.log(u._id);
    axios
      .post("/friendRequest", { requestTo: u._id })
      .then((response) => {
        alert("request sucssec");
      })
      .catch(() => {
        alert("request failed");
      });
  };
  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb:20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar text={text} />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* Left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} onUpdateClick={handShowUpdateProfile} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* Center */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645">
                <span>Người dùng</span>
              </div>

              <div className="w-full flex flex-col gap-4 py-4">
                {users?.map((u) => (
                  <div
                    className="flex items-center justify-between"
                    key={u._id}
                  >
                    <Link
                      to={"/profile/" + u._id}
                      key={u?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={u?.profileUrl ?? NoProfile}
                        alt={u?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />

                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {u?.firstName} {u?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {u?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => handFriendRequest(u)}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* Friend Request */}
            {/* <div className="w-full bg-primary shadow-sm rounded-lg px-4 pt-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Lời mời kết bạn</span>
                <span>{friendRequest?.length}</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={"/profile/" + from._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1 ">
                      <CustomButton
                        title="Xác nhận"
                        containerStyles="bg-[#0444a4] text-xs text-white rounded-2xl min-w-16 pl-1.5 py-1 text-center items-center"
                      />
                      <CustomButton
                        title="Xóa"
                        containerStyles="border border-[#666] text-xs  px-1.5 rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

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
export default Search;
