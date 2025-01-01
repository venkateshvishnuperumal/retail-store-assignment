import React, { Suspense } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
const ProductTable = React.lazy(() => import("./components/ProductTable"));
const CartPage = React.lazy(() => import("./components/CartPage"));
const Loader = () => <div>Loading...</div>;

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<ProductTable />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
