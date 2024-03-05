import React, { useState } from "react";
import "../assets/css/register.css";

import resigterSvg from "../assets/images/registerPage_highschool.svg";

import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import { useAuth } from "../context/AuthContext";

import { googleSignIn, register } from "../api/userApi";

import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Register = () => {
  const navigate = useNavigate();
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [auth, setAuth] = useAuth();

  const handleRegister = async evt => {
    evt.preventDefault();

    if (!full_name) {
      toast.error("Name is required", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!email) {
      toast.error("Email is required", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!password) {
      toast.error("Password is required", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!confirmPassword) {
      toast.error("Confirm Password is required", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    const data = { full_name, email, password, confirmPassword, last_activity: new Date().toISOString() };

    try {
      const response = await register(data);
      console.log(response);

      if (response.status === 200 && response.statusText === "OK") {
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });

        const givenRole = response.data.user.role;

        if (givenRole === "USER") {
          navigate("/campus-flow/user/selectUniversity");
        } else {
          navigate("/campus-flow/admin/home");
        }
      } else if (
        response.response.status === 400 ||
        response.response.status === 409
      ) {
        const errorMessage = response.response.data.message;

        const errMsg = errorMessage.replace(/^\['(.*)'\]$/, "$1");

        toast.error(errMsg, {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSignup = async googleUser => {
    try {
      const response = await googleSignIn({
        access_token: googleUser.getAuthResponse().id_token,
      });

      setAuth({
        ...auth,
        user: response.data.data,
        token: response.data.token,
      });

      const dedicatedRole = response.data.data.role;

      if (dedicatedRole === "USER") {
        navigate("/campus-flow/user/selectUniversity");
      } else {
        navigate("/campus-flow/admin/home");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const togglePasswordViewChange = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordViewChange = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register">
      <div className="register__wrapper">
        <div className="register__left">
          <h2 className="register__title">Sign up</h2>
          <p className="register__already-account">
            Already have account?{" "}
            <span
              style={{
                color: "#439a86",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              <a onClick={() => navigate("/campus-flow/login")}>Log in</a>
            </span>
          </p>
          <form action="#" className="register__form">
            <div className="register__inputGroup">
              <input
                type="text"
                value={full_name}
                onChange={evt => setFullName(evt.target.value)}
                className="register__name"
                name="name"
                id="name"
                placeholder="Name"
                required
              />
              <FaUser className="userIcon" />
            </div>

            <div className="register__inputGroup">
              <input
                type="email"
                value={email}
                onChange={evt => setEmail(evt.target.value)}
                name="email"
                className="register__email"
                id="email"
                placeholder="Email"
                required
              />
              <MdEmail className="mailIcon" />
            </div>
            <div className="register__inputGroup">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={evt => setPassword(evt.target.value)}
                className="register__password"
                name="password"
                id="password"
                placeholder="Password"
                required
              />
              {showPassword ? (
                <FaEye className="eyeIcon" onClick={togglePasswordViewChange} />
              ) : (
                <FaEyeSlash
                  className="eyeIcon"
                  onClick={togglePasswordViewChange}
                />
              )}
            </div>
            <div className="register__inputGroup">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={evt => setConfirmPassword(evt.target.value)}
                className="register__confirmPassword"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                required
              />
              {showConfirmPassword ? (
                <FaEye
                  className="eyeIcon"
                  onClick={toggleConfirmPasswordViewChange}
                />
              ) : (
                <FaEyeSlash
                  className="eyeIcon"
                  onClick={toggleConfirmPasswordViewChange}
                />
              )}
            </div>

            <Button primary rounded onClick={handleRegister}>
              Sign Up
            </Button>
          </form>

          {/* snapple separator with or text in between */}
          {/* start */}
          <div className="register__alternate-signin-container">
            <div className="register__or-separator">
              <span className="register__or-text">or</span>
            </div>

            <GoogleLogin
              style={{ paddingLeft: "20px" }}
              className="google__loginButton"
              clientId="939129256680-qe0149eq0b5g9oc14cj3lc78inbue6rq.apps.googleusercontent.com"
              buttonText="Continue with Google"
              onSuccess={handleGoogleSignup}
              onFailure={error =>
                console.error("Google Sign-In failed:", error)
              }
              cookiePolicy="single_host_origin"
            />
          </div>
          {/* end */}
        </div>
        <div className="register__right">
          <img className="register__characterSvg" src={resigterSvg} alt="" />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        transition={Zoom}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Register;
