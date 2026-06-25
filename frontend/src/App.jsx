import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import ReviewPage from "./pages/ReviewPage";


import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./admin/layouts/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";

export default function App() {
  return (
    <>
      <Routes>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />
        </Route>

        {/* WEBSITE ROUTES */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route
                  path="/"
                  element={<Home />}
                />
                            
                                    <Route
                                  path="/order-success"
                                  element={
                                    <ProtectedRoute>
                                      <OrderSuccess />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                    path="/products/:id/review"
                                    element={
                                      <ProtectedRoute>
                                        <ReviewPage />
                                      </ProtectedRoute>
                                    }
                                  />
                <Route
                  path="/products"
                  element={<Products />}
                />

                <Route
                  path="/products/:id"
                  element={<ProductDetails />}
                />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/login"
                  element={<Login />}
                />

                <Route
                  path="/register"
                  element={<Register />}
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1000}
      />
    </>
  );
}