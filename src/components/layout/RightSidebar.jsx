import React from "react";
import FriendRequest from "../card/FriendRequest";
import ChallengeList from "../card/ChallengeList";
import SuggestedFriends from "../card/SuggestedFriends";

const RightSidebar = ({ user, loading }) => {
  return (
    <>
      {!loading && (
        <div className="sidebar w-full h-full flex-col gap-6 overflow-y-auto">
          {/* Friend Request */}
          <FriendRequest user={user} />
          <ChallengeList user={user} />
          {/* SUGGESTED Friends */}
          <SuggestedFriends />
        </div>
      )}
    </>
  );
};

export default RightSidebar;
