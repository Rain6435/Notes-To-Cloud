import { useEffect, useState } from "react";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as jwt_decode from "jwt-decode";
import CryptoJS from "crypto-js";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useCookies } from "react-cookie";
import "./LogIn.css";

const LoginPage = () => {
  const [user, setUser] = useState({ email: "", password: "", type: "" });
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["user"]);

  useEffect(() => {
    if (cookies["user"] !== undefined) {
      alert("Already logged in");
      navigate("/mydocs");
    }
  }, []);

  const handleChange = (event:any) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleManualLogin = (event:any) => {
    event.preventDefault();
    var r = CryptoJS.SHA256(user["password"]).toString();
    axios
      .post("http://127.0.0.1:5000/login", {
        user: { email: user["email"], password: r, type: "manual" },
      })
      .then(function (response) {
        if (response.data["status"] === "success") {
          try {
            user["type"] = "manual";
          } catch (error) {
            console.log(error);
          }
          setCookie("user", user, { path: "/" });
          navigate("/mydocs");
        } else {
          alert("Your email or password are not correct.");
          document.getElementById("no_account")!.style.display = "block";
        }
      });
  };

  return (
    <div id="authPage">
      <Link to="/" id="homeBtnContainer">
        <BsArrowLeftCircle id="homeButton"></BsArrowLeftCircle>
      </Link>
      <div id="login">
        <h1>Login</h1>
        <form id="loginForm" onSubmit={handleManualLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              autoComplete="on"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div id="social">
          <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
            <GoogleLogin
              onSuccess={(credentialResponse: CredentialResponse) => {
                axios
                  .post("http://127.0.0.1:5000/login", {
                    gUser: jwt_decode.jwtDecode(credentialResponse.credential!),
                  })
                  .then(function (response) {
                    if (response.data["status"] === "success") {
                      localStorage.setItem("user", response.data["id"]);
                      navigate("/mydocs");
                    } else if (response.data["status"] === "inexistent") {
                      alert(
                        "Your google account isn't linked to any existing account, but we have created you one."
                      );
                      localStorage.setItem("user", response.data["id"]);
                      navigate("/mydocs");
                    } else {
                      alert(
                        "An error occured during the log in phase! Please try again."
                      );
                      localStorage.clear();
                      navigate("/login");
                    }
                  });
              }}
              onError={() => {
                console.log("Error in Google Login.");
                alert("Error in Google Login.");
              }}
            ></GoogleLogin>
          </GoogleOAuthProvider>
        </div>
        <div id="no_account">
          <p>
            No account? Sign up{" "}
            <Link id="here" to="/signup">
              here
            </Link>
            !
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
