/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useId, useRef, useState } from "react";
// import { UserContext } from "./UserContext";
import { Contact } from "../../components/index";
import { uniqBy } from "lodash";
import { ShopContext } from "../../Context/ShopContext";
import { LuSendHorizonal } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
export default function Chat() {
  const [ws, setWs] = useState(null);
  const { id: idSelect } = useParams();
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(idSelect || "");
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState({});
  const { user } = useContext(ShopContext);
  const selectedUserIdRef = useRef(selectedUserId);
  const id = user?._id;
  //   console.log(selectedUserId);

  const divUnderMessages = useRef();
  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    setSelectedUserId(idSelect);
    // console.log(idSelect + "//" + selectedUserId);
  }, [idSelect]);

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  function connectToWs() {
    const webSocket = new WebSocket("ws://localhost:4000");
    setWs(webSocket);
    webSocket.addEventListener("message", handleMessage);
    webSocket.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  async function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId }) => {
      if (userId !== undefined && userId) {
        axios
          .get(`/user/${userId}`)
          .then((res) => {
            const userName = res.data.firstName + " " + res.data.lastName;
            people[userId] = userName;
            setOnlinePeople(people);
          })
          .catch(() => {
            console.log("error");
          });
      }
    });
  }

  async function getNameById(id) {
    if (id) {
      try {
        const res = await axios.get(`/user/${id}`);

        return res.data.firstName + " " + res.data.lastName;
      } catch (error) {
        console.log("get name error");
        return null;
      }
    }
    return null; // Trường hợp id không hợp lệ
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);

    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else {
      const currentSelectedUserId = selectedUserIdRef.current;
      if (currentSelectedUserId !== null) {
        if (currentSelectedUserId === messageData.sender) {
          //   console.log(
          //     idSelect + "/ " + currentSelectedUserId + "/" + messageData.sender
          //   );
          const read = true;
          axios.put("/message/" + currentSelectedUserId, { read });
          setMessages((prev) => [...prev, { ...messageData }]);
        }
      }

      setLastMessage({ ...messageData });
      //   console.log(
      //     idSelect + "/ " + currentSelectedUserId + "/" + messageData.sender
      //   );
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    try {
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
          read: false,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          sender: id,
          recipient: selectedUserId,
          text: newMessageText,
          read: false,
          _id: Date.now(),
        },
      ]);
      setLastMessage({
        sender: id,
        recipient: selectedUserId,
        text: newMessageText,
        read: false,
      });
    } catch (error) {}
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        const { data } = res;

        setMessages(data);
        setLastMessage(data[data.length - 1]);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen">
      <div className=" w-1/3">
        <div className="flex-grow pl-3 pt-3">
          <h2>Mạng xã hội billiards</h2>
          <div className="flex flex-col gap-0 mt-5">
            {Object.keys(onlinePeopleExclOurUser)?.map((userId) => (
              <Link to={`/chat/${userId}`} key={userId}>
                <Contact
                  onClick={() => setSelectedUserId(userId)}
                  key={userId}
                  id={userId}
                  online={true}
                  username={onlinePeopleExclOurUser[userId]}
                  selected={userId === selectedUserId}
                  lastMessage={lastMessage}
                />
              </Link>
            ))}
            {Object.keys(offlinePeople)?.map((userId) => (
              <Link
                //
                to={`/chat/${userId}`}
                key={userId}
              >
                <Contact
                  onClick={() => setSelectedUserId(userId)}
                  key={userId}
                  id={userId}
                  online={false}
                  username={
                    offlinePeople[userId].firstName +
                    " " +
                    offlinePeople[userId].lastName
                  }
                  selected={userId === selectedUserId}
                  lastMessage={lastMessage}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-[#EFF6FF] w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-[#adacac]">
                &larr; Select a person from the sidebar
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map((message, i) => {
                  return (
                    <div
                      key={message._id}
                      className={
                        message.sender === id ? "text-right" : "text-left"
                      }
                    >
                      <div
                        className={
                          "text-left inline-block p-2 my-2 rounded-md text-sm " +
                          (message.sender === id
                            ? "bg-blue text-white"
                            : "bg-[#f0f0f0] text-black")
                        }
                      >
                        {message.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Aa"
              className="bg-[#f0f0f0] flex-grow border-none rounded-xl p-2"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
            />
            <button className="rounded-sm bg-blue-500 p-2 text-white ">
              <LuSendHorizonal className="text-blue w-full text-3xl text font-bold" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
