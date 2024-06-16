//import css LoginForm.css
import "./LoginForm.css";

import { useState } from "react";

const LoginForm = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };
  return (
    <>
      <div
        class={`custom-container ${
          rightPanelActive ? "custom-right-panel-active" : ""
        }`}
        id="custom-container"
      >
        <div class="custom-form-container custom-sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <div class="custom-social-container">
              <a href="#" class="custom-social">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="custom-social">
                <i class="fab fa-google-plus-g"></i>
              </a>
              <a href="#" class="custom-social">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={handleSignUpClick}>Sign Up</button>
          </form>
        </div>
        <div class="custom-form-container custom-sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <div class="custom-social-container">
              <a href="#" class="custom-social">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="custom-social">
                <i class="fab fa-google-plus-g"></i>
              </a>
              <a href="#" class="custom-social">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot your password?</a>
            <button onClick={handleSignInClick}>Sign In</button>
          </form>
        </div>
        <div class="custom-overlay-container">
          <div class="custom-overlay">
            <div class="custom-overlay-panel custom-overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                class="custom-ghost"
                id="custom-signIn"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>
            <div class="custom-overlay-panel custom-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                class="custom-ghost"
                id="custom-signUp"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
