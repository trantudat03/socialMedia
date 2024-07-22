import React, { useState } from "react";
import ProfileCard from "../card/ProfileCard";
import FriendsCard from "../card/FriendsCard";
import EditProfile from "../profile/EditProfile";

const LeftSidebar = ({ user, loading, handShowUpdateProfile }) => {
  return (
    <>
      {!loading && (
        <div className="relative sidebar w-full h-full flex-col gap-6 overflow-y-auto">
          <ProfileCard user={user} onUpdateClick={handShowUpdateProfile} />
          <FriendsCard user={user} length={4} />
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
