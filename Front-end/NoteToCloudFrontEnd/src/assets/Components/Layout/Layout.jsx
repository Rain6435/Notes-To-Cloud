import { Outlet, Link, useNavigate } from "react-router-dom";
import './Layout.css'
import React, { useEffect, useState } from "react";
import axios from "axios";

const Layout = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  function MenuButton(){
    return(
      <div>
        <div id="bar"></div>
        <div id="bar"></div>
        <div id="bar"></div>
      </div>
    );
  }
  const navigate = useNavigate()
  function reshape() {
    if (localStorage.getItem('user') === null) {
      document.getElementById("NavDocs").style.display = 'none';
      document.getElementById("NavLogOut").style.display = 'none';
      document.getElementById("NavSign").style.display = 'block';

    } else {
      document.getElementById("NavSign").style.display = 'none';
      document.getElementById("NavLogOut").style.display = 'block';
      document.getElementById("NavLogin").style.display = 'none';
    }
  }
  function LogOutConfirmation() {
    if (window.confirm("Do you really want to log out?") === true) {
      axios.get("http://127.0.0.1:5000/logout")
        .then(function (response) {
          if (response.data['status'] === 'success') {
            localStorage.clear()
            navigate('/')
          }
        })
    }
  }
  useEffect(() => {
    reshape()
  })
  return (
    <div className="header">
      <ul className={click ? "nav-options active" : "nav-options"}>
        <li id="NavMain" className="option">
          <Link to="/">Home</Link>
        </li>
        <li id="NavLogin" className="option">
          <Link to="/login">Log In</Link>
        </li>
        <li id="NavSign" className="option">
          <Link to="/signup">Sign Up</Link>
        </li>
        <li id="NavDocs" className="option">
          <Link to="/mydocs">Documents</Link>
        </li>
        <li id="NavAboutUS" className="option">
          <Link to='/aboutus'>About Us</Link>
        </li>
        <li id="NavLogOut" className="option">
          <Link onClick={LogOutConfirmation}>Log out</Link>
        </li>
      </ul>
      <div className="mobile-menu-container">
        <div className="mobile-menu" onClick={handleClick}>
        {click ? (
          <MenuButton className="menu-icon"/>
        ) : (
          <MenuButton className="menu-icon" />
        )}
      </div>
      </div>
      
      <Outlet />
    </div>
  )
};

export default Layout;