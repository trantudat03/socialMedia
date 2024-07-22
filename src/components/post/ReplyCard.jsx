import React, { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { Link } from "react-router-dom";
import { NoProfile } from "../../assets";
import moment from "moment";
import { BiLike, BiSolidLike } from "react-icons/bi";

const ReplyCard = ({ reply, user, handleLike }) => {
  const { user: myUser } = useContext(ShopContext);
  //   console.log(reply);
  return (
    <div className="w-full py-2">
      <div className="flex gap-2 items-center mb-1">
        <Link to={"/profile/" + reply?.userId?._id}>
          <img
            src={
              reply?.userId?.profileUrl
                ? `http://localhost:4000/uploads/${reply?.userId?.profileUrl}`
                : NoProfile
            }
            alt={reply?.userId?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={"/profile/" + reply?.userId?._id}>
            <p className="font-medium text-base text-ascent-1">
              {reply?.userId?.firstName} {reply?.userId?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply?.created_At).fromNow()}
          </span>
        </div>
      </div>
      <div className="ml-12">
        <p className="text-ascent-2">{reply?.comment}</p>
        {/* <div className="mt-2 flex gap-6">
          <p
            className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
            onClick={handleLike}
          >
            {reply?.likes?.includes(myUser?._id) ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ReplyCard;
