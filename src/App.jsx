import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login";
import Contact from "./pages/contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/Main";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { callFetchLogin } from "./services/api";
import { doGetAccountAction } from "./redux/account/accountSlice";
import LoadingPages from "./pages/Loading";
import NotFound from "./pages/NotFound";
import AdminPages from "./pages/Admin";
import ProtecedRoute from "./pages/ProtecedRoute";
import LayoutAdmin from "./components/LayoutAdmin";
import User from "./components/LayoutAdmin/User";
import BookPages from "./components/LayoutAdmin/Book";
import Book from "./pages/Book";
import OrderUser from "./pages/OrderUser";
import History from "./pages/History";
import Order from "./pages/Order";

const LayoutUser = () => {
  return (
    <div>
      <Header />
      <Outlet  />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      return;
    }else{
      
    const res = await callFetchLogin();
    // console.log(res);
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
    }

  };

  useEffect(() => {
    getAccount();
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutUser />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Main /> },
        {
          path: "contacts",
          element: <Contact />,
        },
        {
          path: "book/:slug",
          element: <Book />
        },
        {
          path:"order",
          element:<OrderUser />
        },
        {
          path:"history",
          element:<History />
        }
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtecedRoute>
              <AdminPages />
            </ProtecedRoute>
          ),
        },
        {
          path: "user",
          element: <User />,
        },
        {
          path: "order",
          element: <Order />,
        },
        {
          path: "book",
          element: <BookPages />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <LoadingPages />
      )}
    </>
  );
}
