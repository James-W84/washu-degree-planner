import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import TextTypes from "./pages/TextTypes";
import DragAndDrop from "./pages/DragAndDrop";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  // { path: "/logout", element: <Logout /> },
  // {
  //   path: "/profile",
  //   element: <Profile />,
  // },
  // {
  //   path: "/main",
  //   element: <Main />,
  // },
  {
    path: "/textTypes",
    element: <TextTypes />,
  },
  {
    path: "/dragAndDrop",
    element: <DragAndDrop />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
