import React, { createContext, useEffect, useState } from "react";
// import all_product from "../Components/Assets/all_product";
import axios from "axios";

export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};
//   for (let index = 0; index < all_product.length + 1; index++) {
//     cart[index] = 0;
//   }

//   return cart;
// };

const ShopContextProvider = (props) => {
  //   const [cartItems, setCartItems] = useState(getDefaultCart());
  const [user, setUser] = useState(null);
  // console.log(cartItems);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then((response) => {
        //console.log(response)
        if (response !== null) setUser(response.data);
      });
    }
  }, []);

  //   const addToCart = (itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   };

  //   const removeFromCart = (itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  //   };

  //   const getTotalPrice = () => {
  //     let totalPrice = 0;
  //     for (const item in cartItems) {
  //       if (cartItems[item] > 0) {
  //         let product = all_product.find((i) => i.id === item);
  //         totalPrice += product.new_price * cartItems[item];
  //       }
  //     }

  //     return totalPrice;
  //   };

  //   const getTotalQuantity = () => {
  //     let totalQuantity = 0;
  //     for (const item in cartItems) {
  //       if (cartItems[item] > 0) {
  //         totalQuantity += cartItems[item];
  //       }
  //     }

  //     return totalQuantity;
  //   };

  const contextValue = {
    // all_product,
    // cartItems,
    // addToCart,
    // removeFromCart,
    // getTotalPrice,
    // getTotalQuantity,
    user,
    setUser,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
