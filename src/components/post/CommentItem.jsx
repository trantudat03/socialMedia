import React, { useEffect, useRef, useState } from "react";
import { NoProfile } from "../../assets";
import { Link } from "react-router-dom";
import moment from "moment";
import { BiLike, BiSolidLike } from "react-icons/bi";
import CommentForm from "./CommentForm";
import ReplyCard from "./ReplyCard";
import { useDispatch, useSelector } from "react-redux";
import { GetReplyByCmt, reset } from "../../redux/replySlice";

const CommentItem = ({ comment, user, getComments }) => {
  const [reply, setReply] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyList, setReplyList] = useState([]);
  const dispatch = useDispatch();
  const { replies, isLoading, isSuccess } = useSelector((state) => state.reply);
  const commentFormRef = useRef(null);

  useEffect(() => {
    setReplyList(comment?.replies);
  }, [comment]);

  const handReply = (cmtId) => {
    setShowReply(true);
    getComments();
  };

  const handShowReply = (cmtId) => {
    setShowReply(true);
  };

  const handFocusReply = () => {
    setReply(true);
    setTimeout(() => {
      if (commentFormRef.current) {
        commentFormRef.current.focus();
        // commentFormRef.current.scrollIntoView({
        //   behavior: "smooth",
        //   block: "start",
        // });
      }
    }, 0);
  };

  return (
    <div className="w-full py-2" key={comment?._id}>
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/profile" + comment?.userId?._id}>
          <img
            src={
              comment?.userId?.profileUrl
                ? `http://localhost:4000/uploads/${comment?.userId?.profileUrl}`
                : NoProfile
            }
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={"/profile" + comment?.userId?._id}>
            <p className="font-medium text-base text-ascent-1">
              {comment?.userId?.firstName} {comment?.userId?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(comment?.createdAt ?? "2023-05-24").fromNow()}
          </span>
        </div>
      </div>

      <div className="ml-12 ">
        <p className="text-ascent-2">{comment?.comment}</p>
        <div className="mt-2 flex gap-6">
          <p className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer">
            {comment?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} />
            )}
            {comment?.likes?.length} Likes
          </p>
          <span className="text-blue cursor-pointer" onClick={handFocusReply}>
            Phản hồi
          </span>
        </div>
      </div>
      {/* Replies */}
      <div className=" px-8">
        {comment?.replies?.length > 0 && !showReply && (
          <p
            className="text-base text-ascent-1 cursor-pointer py-2"
            onClick={() => {
              setShowReply(true);
            }}
          >
            Xem phản hồi ({comment?.replies?.length})
          </p>
        )}

        {showReply &&
          replyList?.map((reply) => (
            <ReplyCard reply={reply} user={user} key={reply?._id} />
          ))}
      </div>
      {reply && (
        <CommentForm
          ref={commentFormRef}
          user={user}
          id={comment?._id}
          replyAt={comment?.from}
          getComments={() => handReply(comment?._id)}
        />
      )}
    </div>
  );
};

export default CommentItem;
