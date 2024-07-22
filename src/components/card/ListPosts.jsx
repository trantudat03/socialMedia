import React, { useEffect, useState } from "react";
import { Loading, Modal, PostCard, PostModal } from "../index";
import InfiniteScroll from "react-infinite-scroll-component";

const ListPosts = ({ loadMorePosts, hasMore, postList }) => {
  const [detailPost, setDetailPost] = useState(false);
  const [postFocus, setPostFocus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postList) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [postList]);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  const handShowDetail = (e) => {
    console.log(e);
    setPostFocus(e);
    setDetailPost(true);
  };

  return (
    <InfiniteScroll
      dataLength={postList?.length}
      next={loadMorePosts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more posts to show</p>}
      className="flex-1 h-full flex flex-col gap-6  rounded-lg overflow-y-auto"
    >
      {loading ? (
        <Loading />
      ) : postList?.length > 0 ? (
        postList?.map((post) => (
          <PostCard
            key={post?._id}
            post={post}
            deletePost={handleDelete}
            likePost={handleLikePost}
            handDetail={handShowDetail}
          />
        ))
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-lg text-ascent-2">No Post Available</p>
        </div>
      )}
      {
        <Modal
          showModal={detailPost}
          children={<PostModal post={postFocus} setShowModal={setDetailPost} />}
          setShowModal={setDetailPost}
        />
      }
    </InfiniteScroll>
  );
};

export default ListPosts;
