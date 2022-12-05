import React, { useState } from "react";
import "./Navbar.scss";
import { MdOutlineSchema } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import {
  AiOutlineMenu,
  AiOutlineFieldTime,
  AiOutlineBarChart,
} from "react-icons/ai";
import { TbFileInvoice } from "react-icons/tb";
import { BsArrowLeft } from "react-icons/bs";

import { Link } from "react-router-dom";

type Props = {};

const Navbar = (props: Props) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <div className={menuIsOpen ? "navbar" : "navbar--mobile"}>
      <div className="navbar__section">
        <div onClick={toggleMenu}>
          {menuIsOpen ? (
            <BsArrowLeft className="navbar__toggle-icon" />
          ) : (
            <AiOutlineMenu className="navbar__toggle-icon" />
          )}
        </div>
        {menuIsOpen ? <h3 className="navbar__title">Dashboard</h3> : <></>}
        <div
          className={
            menuIsOpen ? "navbar__container" : "navbar__container--closed"
          }
        >
          <Link to="/">
            <div className="navbar__item">
              <AiOutlineBarChart className="navbar__item__icon" />
              <p className="navbar__item__text">Overview</p>
            </div>
          </Link>
          <Link to="/invoice">
            <div className="navbar__item">
              <TbFileInvoice className="navbar__item__icon" />
              <p className="navbar__item__text">Invoice</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
