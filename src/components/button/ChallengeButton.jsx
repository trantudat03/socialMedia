import React from "react";
import { RiSwordLine } from "react-icons/ri";
const ChallengeButton = ({ onClick }) => {
  const handChallenge = () => {
    alert("hello");
  };

  return (
    <button className="w-full h-full">
      <RiSwordLine className="w-full h-full text-3xl text-blue text-opacity-70 hover:text-blue" />
    </button>
  );
};

export default ChallengeButton;
