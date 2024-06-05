import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import axios from "axios";
import ChallengeButton from "./ChallengeButton";

const FriendsCard = ({ user }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`/user/${user._id}/friends`)
        .then((res) => {
          setFriends(res.data);
        })
        .catch(() => {
          alert("Get Friends error");
        });
    }
  }, []);

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
    <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Bạn bè</span>
        <span>{friends?.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {friends?.slice(0, 4).map((friend, i) => (
          <div className="flex  items-center">
            <Link
              to={`/profile/${friend?._id}`} // Fixed Link path
              key={i}
              className="flex gap-4 items-center cursor-pointer min-w-40"
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
            <div
              className="ml-10 w-8 h-8 cursor-pointer "
              onClick={() => handChallenge(friend)}
            >
              <ChallengeButton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsCard;
