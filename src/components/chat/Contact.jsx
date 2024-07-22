/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Avatar } from "../index.js";
import { ShopContext } from "../../Context/ShopContext.jsx";
// import { UserContext } from "./UserContext.jsx";

export default function Contact({
  id,
  username,
  onClick,
  selected,
  online,
  lastMessage,
}) {
  const { user } = useContext(ShopContext);
  //   console.log(lastMessage.sender, youId);
  const youId = user?._id;
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        "border-b border-[#F5F5F5] flex items-center gap-2 rounded-sm cursor-pointer " +
        (selected ? "bg-[#8bbff0]" : "")
      }
    >
      {selected && <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} username={username} userId={id} />
        <div>
          <p className="text-gray-800 text-xl">{username}</p>
          {Object.keys(lastMessage || {})?.length !== 0 &&
            ((lastMessage.sender === youId && lastMessage.recipient === id) ||
              (lastMessage.sender === id &&
                lastMessage.recipient === youId)) && (
              <p
                className={
                  "m-0 p-0 " +
                  (lastMessage && lastMessage.read === true
                    ? "text-pink-400"
                    : "text-orange-400")
                }
              >
                {lastMessage && lastMessage.sender === youId ? "You: " : ""}{" "}
                {lastMessage && lastMessage.text}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
