import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../../assets";
import moment from "moment";
import "moment/locale/vi";
import { BiSolidLike, BiLike, BiComment } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import {
  TextInput,
  Loading,
  CustomButton,
  CommentForm,
  CommentItem,
} from "../index";
// import { postComments } from "../assets/data";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext";
import { IoIosClose } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { GetAllComments, reset } from "../../redux/commentSlice";

const PostModal = ({
  post,
  deletePost,
  likePost,
  handDetail,
  setShowModal,
}) => {
  const [showAll, setShowAll] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cmtLength, setCmtLength] = useState(post?.comments?.length);
  const [likes, setLikes] = useState(post?.likes);
  const { user } = useSelector((state) => state.auth);
  const [myUser, setMyUser] = useState({});

  useEffect(() => {
    // console.log(user);
    if (user) {
      setMyUser(user);
    }
  }, [user]);
  const dispatch = useDispatch();
  const commentFormRef = useRef(null);
  const {
    comments: cmts,
    isLoading,
    isSuccess,
  } = useSelector((state) => state.comment);
  const getComments = () => {
    // setReplyComments(0);
    // if (showReply.indexOf(id) === -1) {
    //   handShowReply(id);
    // }

    dispatch(GetAllComments(post?._id));

    // console.log(res.data);

    setLoading(false);
  };

  useEffect(() => {
    // console.log(isSuccess);
    // console.log(user);
    if (cmts || isSuccess) {
      setComments(cmts);
      setCmtLength(cmts?.length);
    }
    dispatch(reset());
  }, [isSuccess, dispatch]);

  useEffect(() => {
    dispatch(GetAllComments(post?._id));
  }, [post]);

  const handleLike = async () => {};
  const handleLikePost = async (post) => {
    axios
      .post(`/likePost/${post._id}`)
      .then((res) => {
        console.log(res.data);
        setLikes(res.data.data.likes);
      })
      .catch(() => {
        alert("Error");
      });
  };
  const handleCommentClick = () => {
    if (commentFormRef.current) {
      commentFormRef.current.focus();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full border border-gray-400 flex flex-col h-full">
      <div className="sticky top-0 rounded-t-lg flex justify-center py-3 border-b border-gray-300 bg-white">
        <h3 className="text-xl font-bold">
          Bài viết của {post?.userId?.lastName + " " + post?.userId?.firstName}
        </h3>
        <div
          className="absolute right-2 text-3xl cursor-pointer text-black bg-gray-300 rounded-full hover:opacity-90"
          onClick={() => setShowModal(false)}
        >
          <IoIosClose />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className=" w-full max-h-full scrollable-content overflow-y-auto pt-2 bg-white">
          <div className="flex gap-3 px-2 items-center">
            <Link to={"/profile/" + post?.userId?._id}>
              <img
                src={
                  post?.userId?.profileUrl
                    ? `http://localhost:4000/uploads/${post?.userId?.profileUrl}`
                    : NoProfile
                }
                alt={post?.userId?.firstName}
                className="w-14 h-12 object-cover rounded-full"
              />
            </Link>

            <div className="px-2 w-full flex justify-between">
              <div className="">
                <Link to={"/profile/" + post?.userId?._id}>
                  <p className="font-medium text-lg text-ascent-1">
                    {post?.userId?.firstName} {post?.userId?.lastName}
                  </p>
                </Link>
                <span className="text-ascent-2">{post?.userId?.location}</span>
              </div>

              <span className="text-ascent-2">
                {moment(post?.createdAt ?? "error")
                  .locale("vi")
                  .fromNow()}
              </span>
            </div>
          </div>

          <div className="">
            <p className="text-ascent-2 px-3">
              {showAll === post?._id
                ? post?.description
                : post?.description?.slice(0, 300)}
              {post?.description?.length > 301 &&
                (showAll === post?._id ? (
                  <span
                    className="text-blue ml-2 font-medium cursor-pointer"
                    onClick={() => setShowAll(0)}
                  >
                    Ẩn bớt
                  </span>
                ) : (
                  <span
                    className="text-blue ml-2 font-medium cursor-pointer"
                    onClick={() => setShowAll(post?._id)}
                  >
                    Xem thêm
                  </span>
                ))}
            </p>

            {post?.image && (
              <img
                src={`http://localhost:4000/uploads/${post.image}`}
                alt="post"
                className="w-full mt-2 "
              />
            )}
          </div>

          <div className=" bg-white  flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-gray-300">
            <p className="flex gap-2 items-center text-base cursor-pointer">
              {likes?.length} Thích
            </p>

            <p className="flex gap-2 items-center text-base cursor-pointer">
              {cmtLength} Bình luận
            </p>

            {user?._id === post?.userId?._id && (
              <div
                className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
                onClick={() => deletePost(post?._id)}
              >
                <MdOutlineDeleteOutline size={20} />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-14 py-2 border-t border-gray-300">
            <div
              onClick={() => handleLikePost(post)}
              className="cursor-pointer flex gap-1 items-center text-base text-gray-950 hover:opacity-85"
            >
              {likes?.includes(myUser?._id) ? (
                <>
                  <BiSolidLike size={20} color="blue" />
                  <span className="text-blue-800">Thích</span>
                </>
              ) : (
                <>
                  <BiLike size={20} />
                  <span>Thích</span>
                </>
              )}
            </div>
            <div
              className="cursor-pointer flex gap-1 items-center text-base text-gray-950 hover:opacity-85"
              onClick={handleCommentClick}
            >
              <FaRegComment />
              <span>Bình luận</span>
            </div>
            <div className="cursor-pointer flex gap-1 items-center text-base text-gray-950 hover:opacity-85">
              <IoShareSocialOutline />
              <span>Chia sẻ</span>
            </div>
          </div>

          {/* Comments */}
          {
            <div className="w-full mt-4 px-3 border-t border-[#66666645] ">
              {loading ? (
                <Loading />
              ) : comments?.length > 0 ? (
                comments?.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    user={user}
                    getComments={getComments}
                  />
                ))
              ) : (
                <span className="flex text-sm py-4 text-ascent-2 text-center">
                  Bài viết chưa có bình luận nào
                </span>
              )}
            </div>
          }
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-gray-300 bg-white rounded-b-lg p-2">
        <CommentForm
          ref={commentFormRef}
          user={user}
          id={post?._id}
          getComments={() => getComments(post?._id)}
        />
      </div>
    </div>
  );
};
export default PostModal;
