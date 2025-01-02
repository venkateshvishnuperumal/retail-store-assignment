import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button } from "@mui/material";
import { ShoppingCart, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import Sidebar from "./Sidebar";
import { fetchProducts } from "../service/ProductApi";
import ProductDetailsDialog from "./ProductDetails";

const ProductTable = () => {
  const [paginationModel, setPaginationModel] = useState(() => {
    const savedPagination = localStorage.getItem("paginationModel");
    return savedPagination
      ? JSON.parse(savedPagination)
      : { page: 0, pageSize: 20 };
  });
  useEffect(() => {
    localStorage.setItem("paginationModel", JSON.stringify(paginationModel));
  }, [paginationModel]);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    return savedCategory ? JSON.parse(savedCategory) : null;
  });

  useEffect(() => {
    localStorage.setItem("selectedCategory", JSON.stringify(selectedCategory));
  }, [selectedCategory]);

  const { cartItems, addToCart } = useCart();
  const rowCountRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { products, categories, totalResults } = await fetchProducts(
        paginationModel.page + 1
      );
      setAllProducts(products);
      setFilteredProducts(products);
      rowCountRef.current = totalResults;
      setCategories(categories);
      setLoading(false);
    };
    fetchData();
  }, [paginationModel.page]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = allProducts.filter((product) => {
        const mainCategory = product.main_category || "Others";
        const subCategory1 = product.category_level_1 || "Others";
        const subCategory2 = product.category_level_2 || "Others";
        return (
          mainCategory === selectedCategory.mainCategory &&
          (!selectedCategory.subCategory ||
            subCategory1 === selectedCategory.subCategory ||
            subCategory2 === selectedCategory.subCategory)
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedCategory, allProducts]);

  const handleCategoryChange = (categoryPath) => {
    const [main, level1, level2] = categoryPath;

    setSelectedCategory({
      mainCategory: main || "Others",
      subCategory: level1 || null,
      subSubCategory: level2 || null,
    });

    const filtered = allProducts.filter((product) => {
      const matchesMain =
        product.main_category === main ||
        (!product.main_category && main === "Others");
      const matchesLevel1 =
        !level1 ||
        product.category_level_1 === level1 ||
        (!product.category_level_1 && level1 === "Others");
      const matchesLevel2 =
        !level2 ||
        product.category_level_2 === level2 ||
        (!product.category_level_2 && level2 === "Others");
      return matchesMain && matchesLevel1 && matchesLevel2;
    });

    setFilteredProducts(filtered);
  };

  const rowCount = useMemo(() => rowCountRef.current, [rowCountRef.current]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `₹${params.value || 0}`,
    },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.images?.front || "https://via.placeholder.com/50"}
          alt={params.row.name}
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleViewDetails(params.row)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const rows = filteredProducts.map((product, index) => ({
    ...product,
    id: index + 1,
    price: product.mrp?.mrp || 0,
  }));

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
      <div style={{ width: "80%", paddingLeft: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <TextField
            label="Search by Product Name"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ShoppingCart
            style={{ cursor: "pointer", fontSize: "30px" }}
            onClick={() => navigate("/cart")}
          />
          <Home
            style={{ cursor: "pointer", fontSize: "30px" }}
            onClick={() => navigate("/")}
          />
        </div>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          pageSizeOptions={[20]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
        <ProductDetailsDialog
          open={openDialog}
          product={selectedProduct}
          onClose={handleCloseDialog}
          onAddToCart={addToCart}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </div>
  );
};

export default ProductTable;
