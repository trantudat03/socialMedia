import React from "react";

const FormFilter = () => {
  return (
    <div className="border-t pt-4 border-gray-300">
      <h3 className="text-lg font-semibold mb-2">Bộ lọc</h3>
      <ul className="space-y-2 text-lg flex flex-col gap-2 ">
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=📄"
            alt="all-icon"
          />
          <span>Tất cả</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=💬"
            alt="posts-icon"
          />
          <span>Bài viết</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=👥"
            alt="people-icon"
          />
          <span>Mọi người</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=🖼️"
            alt="photos-icon"
          />
          <span>Ảnh</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=🎥"
            alt="videos-icon"
          />
          <span>Video</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=🏪"
            alt="marketplace-icon"
          />
          <span>Marketplace</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=📌"
            alt="pages-icon"
          />
          <span>Trang</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=📍"
            alt="places-icon"
          />
          <span>Địa điểm</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=👥"
            alt="groups-icon"
          />
          <span>Nhóm</span>
        </li>
        <li className="flex items-center p-2 rounded-lg text-[#333] cursor-pointer font-semibold ">
          <img
            className="w-6 h-6 mr-2"
            src="https://placehold.co/24x24?text=⭐"
            alt="events-icon"
          />
          <span>Sự kiện</span>
        </li>
      </ul>
    </div>
  );
};

export default FormFilter;
