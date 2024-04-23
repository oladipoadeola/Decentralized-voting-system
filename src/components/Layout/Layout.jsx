import React from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

export default function Layout(props) {
  return (
    <div>
      <Navbar data={props} />
      {props.children}
      <Footer />
    </div>
  );
}
