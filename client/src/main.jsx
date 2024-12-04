import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import history from "./history";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import "./index.css";
import InventoryContextProvider from "./pages/inventory/InventoryContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router history={history} basename="/">
    <InventoryContextProvider >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />                          

    <App />
    </InventoryContextProvider>
  </Router>
);
