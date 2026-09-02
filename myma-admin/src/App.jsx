import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";


function App() {
  return (
    <Routes>

      {/* ==========================================
          ADMIN LOGIN
      ========================================== */}

      <Route
        path="/login"
        element={<AdminLogin />}
      />


      {/* ==========================================
          DASHBOARD
      ========================================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />


      {/* ==========================================
          PRODUCTS
      ========================================== */}

      <Route
        path="/products"
        element={<Products />}
      />


      {/* ==========================================
          ADD PRODUCT
      ========================================== */}

      <Route
        path="/products/add"
        element={<AddProduct />}
      />


      {/* ==========================================
          EDIT PRODUCT
      ========================================== */}

      <Route
        path="/products/edit/:id"
        element={<EditProduct />}
      />

<Route
  path="/categories"
  element={<Categories />}
/>

<Route
  path="/orders"
  element={<Orders />}
/>
      {/* ==========================================
          DEFAULT
      ========================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;