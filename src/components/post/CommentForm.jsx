import { LuSendHorizonal } from "react-icons/lu";
import TextInput from "../input/TextInput";
import { NoProfile } from "../../assets";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useImperativeHandle, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendReply } from "../../redux/replySlice";
import { SendComment } from "../../redux/commentSlice";

const CommentForm = forwardRef(({ user, id, replyAt, getComments }, ref) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = (data) => {
    const name = user.firstName + +user.lastName;
    console.log(user);
    // console.log(data);
    if (data.comment) {
      if (replyAt) {
        const payload = {
          comment: data.comment,
          from: name, // Assuming `user.name` contains the name
          replyAt,
        };

        dispatch(SendReply({ cmtId: id, payload })).then(() => {
          getComments();
          reset();
        });

        //   alert("reply success");
      } else {
        const payload = {
          comment: data.comment,
          from: name, // Giả định `user.name` chứa tên
        };

        dispatch(SendComment({ idPost: id, payload })).then(() => {
          getComments();
          reset();
        });
      }
    }
  };
  //   Expose the focus method to parent components
  useImperativeHandle(ref, () => ({
    focus() {
      // Focus on the textarea element
      document.getElementById(`${id}`).focus();
      const rect = document.getElementById(`${id}`).getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);
      if (!isVisible)
        document.getElementById(`${id}`).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    },
  }));
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
      <div
        className={
          replyAt
            ? "w-2/3 relative flex items-center"
            : "relative w-full flex items-center"
        }
      >
        <img
          src={
            user?.profileUrl
              ? `http://localhost:4000/uploads/${user?.profileUrl}`
              : NoProfile
          }
          alt={"avatar"}
          className={
            replyAt
              ? " w-10 h-8 object-cover rounded-full"
              : "w-14 h-12 object-cover rounded-full "
          }
        />
        <TextInput
          idInput={id}
          name="comment"
          styles={replyAt ? "w-full h-8 rounded-full" : "w-full rounded-full"}
          placeholder={
            replyAt ? `Trả lời @${replyAt}` : "Bình luận bài viết này"
          }
          register={register("comment", {
            // required: "Comment can not be empty",
          })}
          //   error={errors.comment ? errors.comment.message : ""}
        />
        <button
          type="submit"
          className={
            replyAt
              ? "absolute top-1 right-3 text-blue-700 mt-2"
              : "absolute top-3 right-4 text-blue-700 mt-2"
          }
        >
          <LuSendHorizonal size={23} />
        </button>
      </div>
      {errMsg?.message && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg?.status === "failed"
              ? "text-[#f64949fe]"
              : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}
      {/* <div className="flex items-end justify-end">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            title="Đăng"
            type="submit"
            containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"
          />
        )}
      </div> */}
    </form>
  );
});

export default CommentForm;
