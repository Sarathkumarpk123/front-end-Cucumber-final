import React, { useEffect, useState } from 'react';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
  const [token, setToken] = useState("");
  const [currState, setCurrState] = useState("Login"); // Login or Sign Up state
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (token) {
      console.log("Token successfully set:", token); // Token will be logged here after state updates
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (currState === "Login") {
        // First try to login as a user
        response = await fetch('https://entri-final-project-cucumber-backend.onrender.com/login/userlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        // If user login fails, try to login as an admin
        if (!response.ok) {
          response = await fetch('https://entri-final-project-cucumber-backend.onrender.com/login/adminlogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
          });
        }
      } else {
        // Sign up user (only happens if "Sign Up" state is selected)
        response = await fetch('https://entri-final-project-cucumber-backend.onrender.com/usersignup/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });
      }

      const result = await response.json();

      if (response.ok) {
        alert(`${currState} successful!`);
        setToken(result.token); // Set the token
        console.log("Token:", result.token);
        localStorage.setItem("token", result.token); // Store token in localStorage

        setShowLogin(false); // Close the popup
        setTimeout(() => {
          window.location.reload(); // Reload to reflect login status
        }, 100);
      } else {
        alert(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <button onClick={() => setShowLogin(false)}>CLOSE</button>
        <div className='login-popup-title'>
          <h2>{currState}</h2>
        </div>
        <div className='login-popup-inputs'>
          {currState === "Login" ? null : (
            <input
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              type='text'
              placeholder='Your name'
              required
            />
          )}
          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type='email'
            placeholder='Your email'
            required
          />
          <input
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            type='password'
            placeholder='Password'
            required
          />
        </div>

        <div className='current-state-button'>
          <button type='submit'>
            {currState === "Sign Up" ? "Create account" : "Login"}
          </button>
        </div>

        <div className='login-popup-conditions'>
        <div style={{display:'flex', gap:"10px"}}>
          <input type='checkbox' required style={{width:'20px'}}/>
          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>
          </div>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new Account? <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an Account? <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
