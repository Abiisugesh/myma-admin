import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";


function App() {

  return (

    <>
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


        {/* ==========================================
            CATEGORIES
        ========================================== */}

        <Route
          path="/categories"
          element={<Categories />}
        />


        {/* ==========================================
            ORDERS
        ========================================== */}

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ==========================================
            CUSTOMERS
        ========================================== */}

        <Route
          path="/customers"
          element={<Customers />}
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


      {/* ==========================================
          TOAST NOTIFICATION
      ========================================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

    </>

  );

}


export default App;