import React, { useEffect, useState } from "react";
import { ListPosts, FormCreatePost, EditProfile } from "../../components/index";

import LeftSidebar from "../../components/layout/LeftSidebar";
import RightSidebar from "../../components/layout/RightSidebar";
import { useDispatch, useSelector } from "react-redux";
import { Profile } from "../../redux/authSlice";
import { GetPostPagination, reset as resetPost } from "../../redux/postSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [postList, setPostList] = useState([]);
  const {
    user: userSelector,
    isError,
    isSuccess,
  } = useSelector((state) => state.auth);

  const {
    posts,
    isLoading,
    isSuccess: successPost,
    isNewPost,
  } = useSelector((state) => state.post);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    handGetPost();
  }, [page]);

  useEffect(() => {
    if (successPost && posts) {
      //   console.log(posts);
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
  }, [posts, successPost, isNewPost]);

  const handGetPost = () => {
    dispatch(GetPostPagination({ page: page, limit: 4 }));
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (!userSelector) {
      setLoading(true);
      dispatch(Profile());
    }
  }, [dispatch]);

  useEffect(() => {
    if (userSelector || isSuccess) {
      setUser(userSelector);
      //   console.log(user);
      setLoading(false);
    }
  }, [isSuccess, userSelector]);

  const handShowUpdateProfile = () => {
    if (!editProfile) {
      setEditProfile(true);
    } else {
      setEditProfile(false);
    }
  };

  return (
    <>
      {!loading && (
        <div className="home w-full px-0 bg-white flex">
          <div
            className="w-1/4 sticky top-20 "
            style={{ height: "calc(100vh - 5rem)" }}
          >
            <LeftSidebar
              user={user}
              handShowUpdateProfile={handShowUpdateProfile}
            />
          </div>
          {/* Center */}
          <div className="flex-1 px-4 flex flex-col gap-6  rounded-lg  mx-2">
            <FormCreatePost user={user} />
            <ListPosts
              user={user}
              hasMore={hasMore}
              loadMorePosts={loadMorePosts}
              postList={postList}
              loading={loading}
            />
          </div>
          {/* Right */}
          <div
            className="w-1/4 sticky top-20"
            style={{ height: "calc(100vh - 5rem)" }}
          >
            <RightSidebar user={user} loading={loading} />
          </div>
          {editProfile && (
            <EditProfile user={user} onUpdateClick={handShowUpdateProfile} />
          )}
        </div>
      )}
    </>
  );
};
export default Home;
