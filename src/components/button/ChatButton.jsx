import React from "react";
import { Link } from "react-router-dom";
import { BsChatDotsFill } from "react-icons/bs";

const ChatButton = ({ id }) => {
  return (
    <Link to={`/chat/${id}`}>
      <BsChatDotsFill className="w-full h-full text-2xl text-blue text-opacity-70 hover:text-blue" />
    </Link>
  );
};

export default ChatButton;
