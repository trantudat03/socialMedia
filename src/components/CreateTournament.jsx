import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Loading, CustomButton } from "../index";
import { UpdateProfile } from "../redux/userSlice";
import { BiImage, BiImages } from "react-icons/bi";

const CreateTournament = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    console.log(data);
  };
  const handleClose = () => {
    dispatch(UpdateProfile(false));
  };
  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };

  function RadioGroup({ options, register, errors, name }) {
    return (
      <div className="flex-row flex mt-2">
        {options.map((option) => (
          <div key={option.value} className="flex-1">
            <label>
              <input
                type="radio"
                value={option.value}
                {...register(name, { required: "You must select an option" })}
              />
              {option.label}
            </label>
          </div>
        ))}
        {errors[name] && <span>{errors[name].message}</span>}
      </div>
    );
  }
  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-1g text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Tạo Giải Đấu
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                label="Tên Giải Đấu"
                placeholder="Example tournament"
                type="text"
                styles="w-full"
                register={register("tenGiaiDau", {
                  required: "Lỗi tên giải đấu",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />
              <div>
                <label className="text-ascent-2 text-sm mb-2 ">
                  Số Lượng vận động viên
                </label>
                <RadioGroup
                  options={[
                    { value: "32", label: "32 Người" },
                    { value: "48", label: "48 Người" },
                    { value: "64", label: "64 Người" },
                  ]}
                  register={register}
                  errors={errors}
                  name="radioOption"
                />
              </div>
              <TextInput
                label="Thông Tin & Thể Lệ"
                placeholder="..."
                type="text"
                styles="w-full h-30"
                register={register("thongTin", {
                  required: "Lỗi Thông Tin",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />
              <label
                htmlFor="imgUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer "
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="imgUpload"
                  data-max-size="5120"
                  accept=".jpg, .png, .jpeg"
                />
                <BiImages />
                <span>Ảnh Giải Đấu</span>
              </label>

              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              ></label>
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
              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                    title="Submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTournament;
