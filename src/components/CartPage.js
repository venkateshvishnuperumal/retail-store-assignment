import React, { useState } from "react";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, clearCart } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    clearCart();
    setOrderSuccess(true);
  };

  const handleToHome = () => {
    navigate("/");
  };

  const handleGoToShopping = () => {
    navigate("/");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {orderSuccess ? (
        <Box>
          <Typography variant="h6" color="success.main" gutterBottom>
            Order placed successfully!
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoToShopping}
          >
            Go to Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.name}
                  secondary={`Quantity: ${item.quantity} | Price: ₹$${
                    item.mrp.mrp * item.quantity
                  }`}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
          >
            Place Order
          </Button>

          <Button variant="outlined" color="primary" onClick={handleToHome}>
            Home
          </Button>
        </>
      )}
    </Box>
  );
};

export default CartPage;
