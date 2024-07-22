import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
const Modal = ({ showModal, setShowModal, children }) => {
  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-8 pb-8 h-screen">
          {/* Overlay */}
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black opacity-40"
          ></div>
          {/* Modal content */}

          <div className="relative flex flex-col bg-white rounded-lg shadow-x w-full max-w-2xl mx-auto h-full ">
            {/* Close Icon */}

            {/* Body */}
            {/* <div className="relative flex-auto"> */}
            {/* <div
                className=" sticky top-2 right-2 z-99 p-1 text-3xl cursor-pointer text-black bg-gray-200 rounded-full hover:opacity-90 "
                onClick={() => setShowModal(false)}
              >
                <IoIosClose />
              </div> */}
            {children}
            {/* </div> */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
