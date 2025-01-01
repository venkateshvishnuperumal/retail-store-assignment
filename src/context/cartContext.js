import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();
const initialCartState = () => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : [];
};
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(initialCartState);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    const newCartItems = [...cartItems];
    const existingProduct = newCartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      newCartItems.push({ ...product, quantity });
    }

    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const newCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
