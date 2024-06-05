import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  FriendsCard,
  Loading,
  PostCart,
  ProfileCard,
  TopBar,
} from "../components";

import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  //   const { user } = useSelector((state) => state.user);
  //   const [userInfo, setUserInfo] = useState(user);
  //const { posts } = useSelector((state) => state.posts);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`/user/${id}`)
        .then(async (res) => {
          //   console.log(res.data);
          await setUser(res.data);

          axios
            .get(`/posts/${id}`)
            .then((res) => {
              setPosts(res.data.data);
            })
            .catch(() => {
              alert("Get Posts Error");
            });
        })
        .catch(() => {
          alert("Error");
        });
    }
  }, []);

  const handleDelete = () => {};
  const handleLikePost = () => {};
  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb:20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar text={""} />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* Left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <div className="block lg:hidden">
              <FriendsCard friends={user?.friends} />
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
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
          </div>
          {/* Right */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendsCard friends={user?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
