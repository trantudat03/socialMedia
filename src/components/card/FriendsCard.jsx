/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../../assets";
import axios from "axios";
import { ChallengeButton, ChatButton } from "../index";
import { Tooltip } from "react-tooltip";

const FriendsCard = ({ user, length }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`/user/${user._id}/friends`)
        .then(async (res) => {
          await setFriends(res.data);
        })
        .catch(() => {
          alert("Get Friends error");
        });
    }
  }, [user]);

  const handChallenge = (f) => {
    // console.log(u._id);
    axios
      .post("/ChallengeRequest", { requestTo: f._id })
      .then((response) => {
        alert("Challenge sucssec");
      })
      .catch(() => {
        alert("Challenge failed");
      });
  };

  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-6">
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Bạn bè</span>
        <span>{friends?.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {length !== 0 &&
          friends?.slice(0, length).map((friend, i) => (
            <div className="w-full flex  items-center pr-5">
              <Link
                to={`/profile/${friend?._id}`} // Fixed Link path
                key={i}
                className="flex-1 flex gap-4 items-center cursor-pointer"
              >
                <img
                  src={
                    friend?.profileUrl
                      ? `http://localhost:4000/uploads/${friend?.profileUrl}`
                      : NoProfile
                  }
                  alt={friend?.firstName}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="">
                  <p className="text-base font-medium text-ascent-1">
                    {friend?.firstName} {friend?.lastName}
                  </p>
                  <span className="text-sm text-ascent-2">
                    {friend?.profession ?? "No Profession"}
                  </span>
                </div>
              </Link>
              <div className="flex gap-4 justify-between">
                <Tooltip id="fctooltip" />
                <div
                  className=" cursor-pointer w-full"
                  onClick={() => handChallenge(friend)}
                  data-tooltip-id="fctooltip"
                  data-tooltip-content={"Thách đấu"}
                >
                  <ChallengeButton />
                </div>
                <div
                  className=" cursor-pointer w-full"
                  data-tooltip-id="fctooltip"
                  data-tooltip-content={"Nhắn tin"}
                >
                  <ChatButton id={friend._id} />
                </div>
              </div>
            </div>
          ))}
        {length === 0 &&
          friends?.map((friend, i) => (
            <div className="w-full flex  items-center">
              <Link
                to={`/profile/${friend?._id}`} // Fixed Link path
                key={i}
                className="flex-1 flex gap-4 items-center cursor-pointer"
              >
                <img
                  src={
                    friend?.profileUrl
                      ? `http://localhost:4000/uploads/${friend?.profileUrl}`
                      : NoProfile
                  }
                  alt={friend?.firstName}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="">
                  <p className="text-base font-medium text-ascent-1">
                    {friend?.firstName} {friend?.lastName}
                  </p>
                  <span className="text-sm text-ascent-2">
                    {friend?.profession ?? "No Profession"}
                  </span>
                </div>
              </Link>
              <div className="flex">
                <div
                  className=" cursor-pointer "
                  onClick={() => handChallenge(friend)}
                >
                  <ChallengeButton />
                </div>
                <div className="ml-5">
                  <ChatButton id={friend._id} className=" cursor-pointer " />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FriendsCard;
