import React, { useState } from "react";
import Loading from "./Loading";
import PostCart from "./PostCart";

const ListPosts = ({ list, user }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = () => {};
  const handleLikePost = () => {};
  return (
    <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
      {loading ? (
        <Loading />
      ) : list?.length > 0 ? (
        list?.map((post) => (
          <PostCart
            key={post?._id}
            post={post}
            user={user}
            deletePost={handleDelete}
            likePost={handleLikePost}
          />
        ))
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-lg text-ascent-2">No Post Available</p>
        </div>
      )}
      <div className="mb-10"></div>
    </div>
  );
};

export default ListPosts;
