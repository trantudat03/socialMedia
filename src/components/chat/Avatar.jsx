/* eslint-disable react/prop-types */

import axios from "axios";
import { useEffect, useState } from "react";
import { NoProfile } from "../../assets";

// eslint-disable-next-line no-unused-vars
export default function Avatar({ userId, username, online }) {
  const colors = [
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-orange-200",
    "bg-pink-200",
    "bg-fuchsia-200",
    "bg-rose-200",
  ];
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  const [linkImg, setLinkImg] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`/user/${userId}`);
        setLinkImg(res.data.profileUrl);
        // Chuyển log ra ngoài setLinkImg để đảm bảo đúng giá trị
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    // console.log(linkImg);
  }, [userId]);

  return (
    <div className={"w-8 h-8 relative rounded-full flex items-center " + color}>
      <div className="w-full h-full rounded-full ">
        <img
          src={linkImg ? `http://localhost:4000/uploads/${linkImg}` : NoProfile}
          alt="avatar"
          className="w-full h-full rounded-full"
        />
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-[#4bac4e] bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-[#9CA3AF] bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}
