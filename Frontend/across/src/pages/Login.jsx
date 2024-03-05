import "../assets/css/Login.css";
import loginSvg from "../assets/images/loginPage_characterSet.svg";
import GoogleLogin from "react-google-login";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import Button from "../components/Button/Button";
import { googleSignIn, login, storeUserInLocalStorage } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordViewChange = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async evt => {
    evt.preventDefault();

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

    const data = { email, password, last_activity: new Date().toISOString() };

    try {
      const response = await login(data);
      if (response.status === 200 && response.statusText === "OK") {
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });

        const roleAssigned = response.data.user.role;

        if (roleAssigned === "ADMIN") {
          navigate("/admin/home");
        } else {
          navigate("/campus-flow/user/home");
        }
      } else if (response.response.status === 401) {
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleGoogleLogin = async googleUser => {
    try {
      const response = await googleSignIn({
        access_token: googleUser.getAuthResponse().id_token,
        last_activity: new Date().toISOString()
      });

      console.log(response);

      setAuth({
        ...auth,
        user: response.data.data,
        token: response.data.token,
      });

      const dedicatedRole = response.data.data.role;
      console.log(dedicatedRole);

      if (response.data.data.university_name) {
        if (dedicatedRole === "USER") {
          navigate("/campus-flow/user/home");
        } else {
          navigate("/admin/home");
        }
      } else {
        navigate("/campus-flow/user/selectUniversity");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="login">
      <div className="login__wrapper">
        <div className="login__left">
          <img className="login__characterSvg" src={loginSvg} alt="" />
        </div>
        <div className="login__right">
          <h2 className="login__title">Log in</h2>
          <form onSubmit={handleFormSubmit} className="login__form">
            <div className="login__inputGroup">
              <input
                type="email"
                className="login__email"
                placeholder="Email"
                value={email}
                onChange={evt => setEmail(evt.target.value)}
              />
              <MdEmail className="mailIcon" />
            </div>
            <div className="login__inputGroup">
              <input
                type={showPassword ? "text" : "password"}
                className="login__password"
                placeholder="Password"
                value={password}
                onChange={evt => setPassword(evt.target.value)}
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
            <Button primary rounded={true}>
              Let's Start
            </Button>
          </form>

          <div className="login__alternate-signin-container">
            {/* snapple separator with or text in the middle */}
            {/* start */}
            <div className="login__or-separator snapple-seperator">
              <span className="login__or-text">or</span>
            </div>

            {/* end */}

            <GoogleLogin
              style={{ paddingLeft: "20px" }}
              clientId="939129256680-qe0149eq0b5g9oc14cj3lc78inbue6rq.apps.googleusercontent.com"
              buttonText="Continue with Google"
              className="google__loginButton"
              onSuccess={handleGoogleLogin}
              onFailure={error =>
                console.error("Google Sign-In failed:", error)
              }
              cookiePolicy="single_host_origin"
            />
          </div>

          <p className="login__register-redirect">
            Don’t have an account?{" "}
            <span
              style={{
                color: "#439a86",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              <a onClick={() => navigate("/campus-flow/register")}>Sign up</a>
            </span>
          </p>
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
      </div>
    </div>
  );
};

export default Login;
