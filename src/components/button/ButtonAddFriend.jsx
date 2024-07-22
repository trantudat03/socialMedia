import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const ButtonAddFriend = ({ user, friend }) => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    handCheckFriend(friend);
  }, [friendRequest]);

  useEffect(() => {
    axios
      .get("/getFriendRequestAll")
      .then(async (res) => {
        await setFriendRequest(res.data.data);
      })
      .catch(() => {
        console.log("Error");
      });
  }, [user]);

  //   useEffect(() => {

  //   }, [friend]);

  const handCheckFriend = (f) => {
    // Kiểm tra nếu user có danh sách friends

    if (friend) {
      if (user?.friends && user?._id !== friend?._id) {
        // Sử dụng some để kiểm tra nếu có phần tử nào thoả mãn điều kiện
        const isFriend = user?.friends?.some((fr) => fr === f._id);
        if (isFriend) {
          setStatus("Friend");
        } else {
          if (user?._id !== friend?._id) handCheckRequestFriend(f);
        }
        //   return isFriend; // trả về true neu tim thay
      }
    }
  };
  //   console.log("hello");
  const handCheckRequestFriend = (friend) => {
    if (friendRequest) {
      //   console.log(friendRequest);
      // Kiểm tra nếu có phần tử nào trong friendRequest thỏa mãn điều kiện
      const from = friendRequest.some(
        (fr) => fr?.requestFrom?._id === friend?._id
      );
      if (from) {
        setStatus("From");
        return;
      } else {
        const to = friendRequest.some(
          (fr) => fr?.requestTo?._id === friend?._id
        );
        if (to) {
          setStatus("To");
          return;
        } else {
          setStatus("NoStatus");
          return;
        }
      }
    }
  };

  const handFriendRequest = (u) => {
    axios
      .post("/friendRequest", { requestTo: u._id })
      .then((response) => {
        setStatus("To");
        // alert("request sucssec");
        axios
          .get("/getFriendRequestAll")
          .then(async (res) => {
            await setFriendRequest(res.data.data);
          })
          .catch(() => {
            console.log("Error");
          });
      })
      .catch(() => {
        alert("request failed");
      });
  };

  const handDeleteRequest = (id_Friend) => {
    if (id_Friend) {
      const result = friendRequest?.filter(
        (f) =>
          f?.requestFrom?._id === user._id && f?.requestTo?._id === id_Friend
      );
      if (result) {
        const id = result[0]?._id;
        axios
          .delete(`/friendRequest/${id}`)
          .then(async (res) => {
            // setRequest(request.filter((r) => r._id !== id));
            await setStatus("NoStatus");
          })
          .catch(() => {
            console.log("error");
          });
      }
    }
  };

  const handAcceptRequest = (id_Friend) => {
    if (id_Friend) {
      const result = friendRequest?.filter(
        (f) => f.requestTo._id === user._id && f.requestFrom._id === id_Friend
      );
      if (result) {
        const rid = result[0]._id;
        axios
          .post("/acceptRequest", { rid, status: "Accepted" })
          .then((res) => {
            // console.log("helep");
            //   setRequest(request.filter((r) => r._id !== rid));
            setStatus("Friend");
          })
          .catch(() => {
            console.log("error");
          });
      }
    }
  };
  return (
    <div>
      {friend && (
        <div>
          <Tooltip id="fctooltip" />
          {status === "Friend" && (
            <Link
              to={`/chat/${friend?._id}`}
              className="bg-[#ebf5ff] text-x text-[#0066dacf] p-2 rounded-md font-bold hover:bg-[#c3daf4] "
            >
              Nhắn tin
            </Link>
          )}
          {status === "From" && (
            <button
              className="bg-[#ebf5ff] text-x text-[#0066dacf] p-2 rounded-md font-bold hover:bg-[#c3daf4]"
              onClick={() => handAcceptRequest(friend._id)}
            >
              <span className="">Xác nhận kết bạn</span>
            </button>
          )}
          {status === "To" && (
            <button
              className="bg-[#ebf5ff] text-x text-[#0066dacf] p-2 rounded-md font-bold hover:bg-[#c3daf4]"
              onClick={() => handDeleteRequest(friend._id)}
            >
              <span className="">Hủy lời mời</span>
            </button>
          )}
          {status === "NoStatus" && (
            <button
              className="bg-[#ebf5ff] text-x text-[#0066dacf] p-2 rounded-md font-bold hover:bg-[#c3daf4]"
              onClick={() => handFriendRequest(friend)}
            >
              <span className="">Thêm bạn bè</span>
            </button>
          )}
          {status === "" && <></>}
        </div>
      )}
    </div>
  );
};

export default ButtonAddFriend;
