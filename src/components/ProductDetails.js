import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const ProductDetails = ({
  open,
  product,
  onClose,
  onAddToCart,
  quantity,
  setQuantity,
}) => {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent style={{ display: "flex", gap: "20px" }}>
        <img
          src={product?.images?.front || "https://via.placeholder.com/150"}
          alt={product?.name}
          style={{ width: "150px", height: "150px" }}
        />
        <div>
          <Typography variant="h6">{product?.name}</Typography>
          <Typography variant="body1">
            Price: ₹{product?.mrp?.mrp || 0}
          </Typography>
          <Typography variant="body2">{product?.description}</Typography>
          <div
            style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
          >
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              style={{ width: "100px", marginRight: "10px" }}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetails;
