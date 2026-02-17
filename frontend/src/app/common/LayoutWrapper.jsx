"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

export default function LayoutWrapper({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

LayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
