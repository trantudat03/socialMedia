import React, { useContext, useEffect, useState } from "react";
import { NoProfile } from "../../assets";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa6";
import { ButtonAddFriend } from "../index";

const SuggestedFriends = () => {
  const { user } = useContext(ShopContext);
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    axios
      .get("/suggestedFriends")
      .then(async (res) => {
        await setSuggestedFriends(res.data.data);
      })
      .catch(() => {
        console.log("Error");
      });
  }, []);

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

  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-4 pt-5 pb-5">
      <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645] mb-5">
        <span>
          {" "}
          <FaUserPlus className="inline items-center mr-3 text-blue" />
          Đề xuất kết bạn
        </span>
        <span>{suggestedFriends?.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {suggestedFriends?.map((friend) => (
          <div className="flex items-center justify-between" key={friend._id}>
            <Link
              to={"/profile/" + friend._id}
              key={friend?._id}
              className="flex-1 flex gap-4 items-center cursor-pointer"
            >
              <img
                src={
                  friend?.profileUrl
                    ? `http://localhost:4000/uploads/${friend?.profileUrl}`
                    : NoProfile
                }
                alt={friend?.firstName}
                className="w-12 h-12 object-cover rounded-full"
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
              <ButtonAddFriend user={user} friend={friend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;
