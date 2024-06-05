import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import imgi from "../assets/img.jpeg";
import { Link } from "react-router-dom";
const ProductItem = () => {
  return (
    <Link
      to={"/product/1"}
      className="w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px]  bg-white rounded-sm shadow "
      //   onClick={scrollTop}
    >
      <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
        <img
          src={imgi}
          className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
        />
      </div>
      <div className="p-4 grid gap-3">
        <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
          Ten San Pham
        </h2>
        <p className="capitalize text-slate-500">Loai san pham</p>
        <div className="flex gap-3">
          <p className="text-red-600 font-medium">50000</p>
          <p className="text-slate-500 line-through">60000</p>
        </div>
        <button
          className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
          //   onClick={(e) => handleAddToCart(e, product?._id)}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductItem;
