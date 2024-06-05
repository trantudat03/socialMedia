import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import axios from "axios";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { FaUserFriends } from "react-icons/fa";

const FriendRequest = ({ user }) => {
  const [request, setRequest] = useState([]);

  useEffect(() => {
    axios
      .get("/getFriendRequest")
      .then((res) => {
        setRequest(res.data.data);
      })
      .catch(() => {
        console.log("error");
      });
  }, []);

  const handAccept = (rid) => {
    // console.log(rid);
    axios
      .post("/acceptRequest", { rid, status: "Accepted" })
      .then((res) => {
        console.log("helep");
        setRequest(request.filter((r) => r._id !== rid));
      })
      .catch(() => {
        console.log("error");
      });
  };
  const handDelete = (id) => {
    if (id) {
      axios
        .delete(`/friendRequest/${id}`)
        .then((res) => {
          setRequest(request.filter((r) => r._id !== id));
        })
        .catch(() => {
          console.log("error");
        });
    }
  };
  //   console.log(request);

  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-4 pt-5">
      <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>
          {" "}
          <FaUserFriends className="inline items-center mr-3 text-blue" />
          Lời mời kết bạn
        </span>
        <span>{request?.length}</span>
      </div>
      <div className="w-full flex flex-col gap-4 pt-4">
        {request?.map(({ _id, requestFrom: from }) => (
          <div key={_id} className="flex items-center justify-between">
            <Link
              to={"/profile/" + from._id}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={from?.profileUrl ?? NoProfile}
                alt={from?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {from?.firstName} {from?.lastName}
                </p>
                <span className="text-sm text-ascent-2">
                  {from?.profession ?? "No Profession"}
                </span>
              </div>
            </Link>

            <div className="flex gap-1 ">
              <CustomButton
                title="Xác nhận"
                onClick={() => handAccept(_id)}
                containerStyles="bg-[#0444a4] text-xs text-white rounded-2xl min-w-16 pl-1.5 py-1 text-center items-center"
              />
              <CustomButton
                title="Xóa"
                onClick={() => {
                  handDelete(_id);
                }}
                containerStyles="border border-[#666] text-xs  px-1.5 rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
      {/* request */}
    </div>
  );
};

export default FriendRequest;
