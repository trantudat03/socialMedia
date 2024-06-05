import React from "react";
import { TopBar } from "../components";
import BannerProduct from "../components/BannerProduct";
import Sidebar from "../components/Sidebar";
import { SidebarItem } from "../components/SidebarItem";
import ProductItem from "../components/ProductItem";
const Shop = () => {
  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb:20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* Left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <Sidebar>
              <SidebarItem
                // icon={}
                text={"Cue (Cơ)"}
              />
              <SidebarItem
                // icon={}
                text={"Lơ (Cơ)"}
              />
              <SidebarItem
                // icon={}
                text={"Bao tay (Cơ)"}
              />
            </Sidebar>
          </div>

          {/* Center */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <BannerProduct />
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <ProductItem />
              <ProductItem />
              <ProductItem />
              <ProductItem />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
