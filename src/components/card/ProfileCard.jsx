import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../../assets";
import { LiaEditSolid } from "react-icons/lia";
import { FaUserMinus } from "react-icons/fa6";
import { BsBriefcase, BsInstagram, BsFacebook } from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { ShopContext } from "../../Context/ShopContext";
import { Tooltip } from "react-tooltip";
import { ButtonAddFriend } from "../index";
import axios from "axios";
import { FaUserCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Profile } from "../../redux/authSlice";
const ProfileCard = ({ user, onUpdateClick }) => {
  const { user: data, isSuccess } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [friendCheck, setFriendCheck] = useState(false);
  const [friend, setFriend] = useState(false);
  const [myUser, setMyUser] = useState(null);

  useEffect(() => {
    if (!data) {
      dispatch(Profile());
    }
  }, [dispatch]);

  useEffect(() => {
    if (data || isSuccess) {
      setMyUser(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    setFriendCheck(false);
    if (user?.friends?.includes(myUser?._id)) {
      setFriend(true);
    } else {
      setFriend(false);
    }
  }, [user]);

  const handChallenge = (f) => {
    // console.log(u._id);
    axios
      .post("/ChallengeRequest", { requestTo: f?._id })
      .then((response) => {
        alert("Challenge sucssec");
      })
      .catch(() => {
        alert("Challenge failed");
      });
  };
  //   const [updateProfile, setUpdateProfile] = useState(false)
  //   console.log(user);
  const handDeleteFriend = (u) => {
    axios
      .put("/unFriend", { userId: myUser?._id, friendId: user?._id })
      .then(async (res) => {
        await setFriend(false);
        await setMyUser(res.data.data);
        console.log(res.data.data);
      })
      .catch(() => {
        console.log("error");
      });
  };
  const handFriendRequest = (u) => {
    // console.log(u._id);
    axios
      .post("/friendRequest", { requestTo: u?._id })
      .then((response) => {
        alert("request sucssec");
      })
      .catch(() => {
        alert("request failed");
      });
  };

  return (
    <div>
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
        <div className="w-full flex items-center justify-between pb-5 ">
          <Link to={"/profile/" + user?._id} className="flex gap-2">
            <img
              src={
                user?.profileUrl
                  ? `http://localhost:4000/uploads/${user?.profileUrl}`
                  : NoProfile
              }
              alt={user?.email}
              className="w-20 h-20 object-cover rounded-full"
            />
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="text-ascent-2">{"Chưa cập nhật"}</span>
            </div>
          </Link>

          <div className="">
            <Tooltip id="editItem" />
            {user?._id === myUser?._id ? (
              <div
                data-tooltip-content={"Chỉnh sửa thông tin cá nhân"}
                data-tooltip-id="editItem"
              >
                <LiaEditSolid
                  size={30}
                  className="text-blue cursor-pointer"
                  onClick={onUpdateClick}
                />
              </div>
            ) : (
              <div className="">
                {/* <ButtonAddFriend user={myUser} friend={user} /> */}
                {user && user?._id !== myUser?._id && (
                  <div>
                    {friend ? (
                      <div
                        tabIndex={0}
                        onFocus={() => {
                          setFriendCheck(true);
                        }}
                        onBlur={() => {
                          setFriendCheck(false);
                        }}
                        className="relative text-center items-center gap-1 bg-[#e4e6eb] text-x text-[#333] p-2 rounded-md font-semibold cursor-pointer flex hover:bg-[#d7d9de]"
                      >
                        <FaUserCheck />
                        <span>Bạn bè</span>
                        {friendCheck && (
                          <div className="bg-primary  items-center drop-shadow-xl  rounded-md py-3 pl-3 absolute top-9 -right-1/4 -left-1/2 ">
                            <ul>
                              <li
                                onClick={() => {
                                  handDeleteFriend(user);
                                }}
                                className="font-medium py-2 pr-2 cursor-pointer flex items-center gap-2 hover:text-[#000]  text-[#333]"
                              >
                                {/* <div className=""> */} <FaUserMinus />
                                <span>Hủy kết bạn</span>
                                {/* </div> */}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <ButtonAddFriend user={myUser} friend={user} />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {user && user?._id !== myUser?._id && (
          <div className="w-full  flex  gap-2   border-[#66666645]">
            <Link
              to={`/chat/${user?._id}`}
              className="bg-[#ebf5ff] text-x text-[#0066dacf] p-2 rounded-md font-bold hover:bg-[#c3daf4] "
            >
              Nhắn tin
            </Link>

            <div
              onClick={() => handChallenge(user)}
              className="bg-[#ebf5ff] text-x text-[#0066dacf] p-2 rounded-md font-bold cursor-pointer hover:bg-[#c3daf4]"
            >
              Thách đấu
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-2 py-4 mt-4 border-t border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1" />
            <span>{user?.location ?? "Chưa có địa chỉ"}</span>
          </div>

          <div className="flex gap-2 items-center text-ascent-2">
            <BsBriefcase className="text-lg text-ascent-1" />
            <span>{user?.profession ?? "Chưa có nghề nghiệp"}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-t border-[#66666645]">
          <p className="text-xl text-ascent-1 font-semibold">
            {user?.friends?.length} Bạn bè
          </p>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">
              Những người có thể xem thông tin
            </span>
            <span className="text-ascent-1 text-lg">{user?.views?.length}</span>
          </div>

          <span className="text-base text-blue">
            {user?.verified
              ? "Tài khoản được xác minh"
              : "Tài khoản chưa xác minh"}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Tham gia từ</span>
            <span className="text-ascent-1 text-base">
              {user?.createdAt ? moment(user.createdAt).fromNow() : "Unknown"}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 py-4 pb-6 border-t border-[#66666645]">
          <p className="text-ascent-1 text-lg font-semibold">Thông tin khác</p>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsInstagram className="text-xl text-ascent-1" />
            <span>Instagram</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <FaTwitterSquare className="text-xl text-ascent-1" />
            <span>Twitter</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsFacebook className="text-xl text-ascent-1" />
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
