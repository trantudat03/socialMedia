import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import axios from "axios";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { RiSwordLine } from "react-icons/ri";
const ChallengeList = ({ user }) => {
  const [request, setRequest] = useState([]);

  useEffect(() => {
    axios
      .get("/challengeRequest")
      .then((res) => {
        setRequest(res.data.data);
        // console.log(res.data.data);
      })
      .catch(() => {
        console.log("error");
      });
  }, []);

  const handAccept = (rid) => {
    // console.log(rid);
    axios
      .post("/acceptChallenge", { rid, status: "Accepted" })
      .then((res) => {
        // console.log("helep");
        setRequest(request.filter((r) => r._id !== rid));
      })
      .catch(() => {
        console.log("error");
      });
  };
  const handDelete = (id) => {
    if (id) {
      axios
        .delete(`/challengeRequest/${id}`)
        .then((res) => {
          setRequest(request.filter((r) => r._id !== id));
        })
        .catch(() => {
          console.log("error");
        });
    }

    // console.log(r);
  };
  //   console.log(request);

  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-4 pt-5 ">
      <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645] ">
        <span className="">
          <RiSwordLine className="inline items-center mr-3 text-blue" />
          Lời mời giao lưu{" "}
        </span>
        <span>{request?.length}</span>
      </div>
      <div className="w-full flex flex-col gap-4 pt-4 mb-5">
        {request?.map(({ _id, requestFrom: from }) => (
          <div key={_id} className="flex justify-between items-center">
            <Link
              to={"/profile/" + from._id}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={
                  from.profileUrl
                    ? `http://localhost:4000/uploads/${from.profileUrl}`
                    : NoProfile
                }
                alt={from?.firstName}
                className="w-16 h-16 object-cover rounded-full"
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

            <div className="flex gap-1 flex-col ">
              {/* <CustomButton
                title="Chấp nhận"
                onClick={() => handAccept(_id)}
                containerStyles="bg-[#0444a4] text-xs text-white rounded-2xl min-w-20 pl-1.5 py-1 text-center items-center"
              />
              <CustomButton
                title="Từ chối"
                onClick={handDelete}
                containerStyles="border border-[#666] text-xs  px-1.5 rounded-xl"
              /> */}
              <button
                onClick={() => handAccept(_id)}
                className="bg-[#0444a4] border-[#0444a4] border text-white rounded-2xl min-w-20  py-1 text-xs text-center "
              >
                Chấp nhận
              </button>
              <button
                onClick={() => handDelete(_id)}
                className="border-[#666] border rounded-2xl min-w-20  py-1 text-xs text-center "
              >
                Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* request */}
    </div>
  );
};

export default ChallengeList;
