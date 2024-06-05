import React from "react";
import { Link } from "react-router-dom";
import { NoProfile, BgImage } from "../assets";

const MyTournamentCard = () => {
  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Giải Đấu Của Tôi</span>
        <span>3</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        <div className="flex items-center justify-between w-full">
          <span>US OPEN</span>
          <img src={BgImage} className="w-20 h-10 object-cover " />
        </div>
        <div className="flex items-center justify-between w-full">
          <img src={BgImage} className="w-20 h-10 object-cover " />
          <span>UK OPEN</span>
        </div>
        <div className="flex items-center justify-between w-full">
          <img src={BgImage} className="w-20 h-10 object-cover " />
          <span>Ha Noi OPEN</span>
        </div>
      </div>
    </div>
  );
};

export default MyTournamentCard;
