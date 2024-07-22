import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  EditProfile,
  FriendsCard,
  Loading,
  ProfileCard,
  ListPosts,
} from "../../components/index";
import { GetPostByUser, reset as resetPost } from "../../redux/postSlice";

import axios from "axios";
import { GetUserById, reset as resetUser } from "../../redux/userSlice";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [editProfile, setEditProfile] = useState(false);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {
    posts,
    isLoading,
    isSuccess: successPost,
    isNewPost,
  } = useSelector((state) => state.post);
  const { user: userRx, isSuccess: successUser } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(resetUser());
    dispatch(GetUserById(id));
    setPage(1);
    setPostList([]);
  }, [id]);

  useEffect(() => {
    if (successUser && userRx) {
      setUser(userRx);
    }
  }, [successUser, userRx]);

  useEffect(() => {
    if (user) {
      //   setPostList([]);
      handGetPost();
    }
  }, [user]);

  useEffect(() => {
    if (page > 1) {
      handGetPost();
    }
  }, [page]);

  useEffect(() => {
    if (id) {
      if (successPost && posts) {
        console.log(posts);
        if (isNewPost) {
          setPostList((prevPostList) => [posts, ...prevPostList]);
        } else {
          if (page === 1) {
            setPostList(posts);
          } else {
            setPostList((prevPostList) => [...prevPostList, ...posts]);
          }
        }
        setLoading(false);
        dispatch(resetPost());
      }
    }
  }, [posts, successPost]);

  const handGetPost = () => {
    dispatch(resetPost());
    dispatch(GetPostByUser({ page: page, limit: 4, idUser: user?._id }));
  };

  const handShowUpdateProfile = () => {
    if (!editProfile) {
      setEditProfile(true);
    } else {
      setEditProfile(false);
    }
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb:20  bg-bgColor lg:rounded-lg bg-white flex ">
        {/* Left */}
        <div
          className="sidebar w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto sticky top-20 "
          style={{ height: "calc(100vh - 5rem)" }}
        >
          <ProfileCard user={user} onUpdateClick={handShowUpdateProfile} />
        </div>

        {/* Center */}
        <div className="flex-1 h-full px-4 flex flex-col gap-6 rounded-lg">
          {false ? (
            <Loading />
          ) : postList?.length > 0 ? (
            <ListPosts
              postList={postList}
              user={user}
              hasMore={hasMore}
              loadMorePosts={loadMorePosts}
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">Không có bài viết nào!</p>
            </div>
          )}
        </div>
        {/* Right */}
        <div
          className="sidebar w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto sticky top-20 "
          style={{ height: "calc(100vh - 5rem)" }}
        >
          {user && <FriendsCard user={user} length={0} />}
        </div>
      </div>
      {editProfile && (
        <EditProfile user={user} onUpdateClick={handShowUpdateProfile} />
      )}
    </>
  );
};

export default Profile;
