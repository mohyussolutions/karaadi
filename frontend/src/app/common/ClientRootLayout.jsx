"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import PropTypes from "prop-types";

export default function ClientRootLayout({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

ClientRootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
