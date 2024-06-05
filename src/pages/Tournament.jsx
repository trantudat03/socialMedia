// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   TopBar,
//   ProfileCard,
//   FriendsCard,
//   CustomButton,
//   TextInput,
//   Loading,
//   PostCart,
//   EditProfile,
// } from "../components";
// // import { friends, requests, suggest, posts } from "../assets/data";
// import { NoProfile } from "../assets";
// import { Link } from "react-router-dom";
// import { BsPersonFillAdd, BsFiletypeGif } from "react-icons/bs";
// import { BiSolidVideo, BiImages } from "react-icons/bi";
// import { useForm } from "react-hook-form";
// import CreateTournament from "../components/CreateTournament";
// import MyTournamentCard from "../components/MyTournamentCard";

// const Tournament = () => {
//   const { user, edit } = useSelector((state) => state.user);

//   const [friendRequest, setFriendRequest] = useState(requests);
//   const [suggestedFriends, setSuggestedFriends] = useState(suggest);
//   const [errMsg, setErrMsg] = useState("");
//   const [file, setFile] = useState(null);
//   const [posting, setPosting] = useState(false);
//   const [loading, setloading] = useState(false);
//   const [create, setCreate] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors }, // Corrected from fromState to formState
//   } = useForm();
//   const handlePostSubmit = async (data) => {};

//   return (
//     <>
//       <div className="home w-full px-0 lg:px-10 pb:20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
//         <TopBar />

//         <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
//           {/* Left */}
//           <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
//             <MyTournamentCard />
//           </div>

//           {/* Center */}
//           <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
//             <CustomButton
//               type=""
//               containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
//               title="Tạo giải đấu"
//               onClick={() => setCreate(!create)}
//             />
//             {loading ? (
//               <Loading />
//             ) : posts?.length > 0 ? (
//               posts?.map((post) => (
//                 <PostCart
//                   key={post?._id}
//                   post={post}
//                   user={user}
//                   deletePost={() => {}}
//                   likePost={() => {}}
//                 />
//               ))
//             ) : (
//               <div className="flex w-full h-full items-center justify-center">
//                 <p className="text-lg text-ascent-2">No Post Available</p>
//               </div>
//             )}
//           </div>
//           {/* Right */}
//           <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
//             {/* Friend Request */}
//             <div className="w-full bg-primary shadow-sm rounded-lg px-6 pt-5">
//               <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
//                 <span>Friend Request</span>
//                 <span>{friendRequest?.length}</span>
//               </div>
//               <div className="w-full flex flex-col gap-4 pt-4">
//                 {friendRequest?.map(({ _id, requestFrom: from }) => (
//                   <div key={_id} className="flex items-center justify-between">
//                     <Link
//                       to={"/profile/" + from._id}
//                       className="w-full flex gap-4 items-center cursor-pointer"
//                     >
//                       <img
//                         src={from?.profileUrl ?? NoProfile}
//                         alt={from?.firstName}
//                         className="w-10 h-10 object-cover rounded-full"
//                       />
//                       <div className="flex-1">
//                         <p className="text-base font-medium text-ascent-1">
//                           {from?.firstName} {from?.lastName}
//                         </p>
//                         <span className="text-sm text-ascent-2">
//                           {from?.profession ?? "No Profession"}
//                         </span>
//                       </div>
//                     </Link>

//                     <div className="flex gap-1">
//                       <CustomButton
//                         title="Accept"
//                         containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
//                       />
//                       <CustomButton
//                         title="Deny"
//                         containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* SUGGESTED Friends */}
//             <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
//               <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645">
//                 <span>Friend Suggestion</span>
//               </div>

//               <div className="w-full flex flex-col gap-4 py-4">
//                 {suggestedFriends?.map((friend) => (
//                   <div
//                     className="flex items-center justify-between"
//                     key={friend._id}
//                   >
//                     <Link
//                       to={"/profile/" + friend._id}
//                       key={friend?._id}
//                       className="w-full flex gap-4 items-center cursor-pointer"
//                     >
//                       <img
//                         src={friend?.profileUrl ?? NoProfile}
//                         alt={friend?.firstName}
//                         className="w-10 h-10 object-cover rounded-full"
//                       />

//                       <div className="flex-1">
//                         <p className="text-base font-medium text-ascent-1">
//                           {friend?.firstName} {friend?.lastName}
//                         </p>
//                         <span className="text-sm text-ascent-2">
//                           {friend?.profession ?? "No Profession"}
//                         </span>
//                       </div>
//                     </Link>
//                     <div className="flex gap-1">
//                       <button
//                         className="bg-[#0444a430] text-sm text-white p-1 rounded"
//                         onClick={() => {}}
//                       >
//                         <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {create && <CreateTournament />}
//     </>
//   );
// };

// export default Tournament;
