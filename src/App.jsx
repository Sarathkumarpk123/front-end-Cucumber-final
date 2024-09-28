import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/Place Order/PlaceOrder';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Footer from './components/Footer/Footer';
import About from './pages/About/About';
import Menu from './pages/Menu/Menu';
import Allfood from './components/Allfood/Allfood';
import Payment from './components/Payment/Payment';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false); // State to control login popup visibility
  const [token, setToken] = useState("");            // State to store JWT token
  const [role, setRole] = useState("");              // State to store user role (admin/user)
  const [cart, setCart] = useState([]);              // State to manage cart items
console.log("rolesss", role)
  // Fetch the token from localStorage and check the user's role
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);

      // Fetch the user's role from the backend
      fetch('https://entri-final-project-cucumber-backend.onrender.com/checkRole/checkRole', { // Full URL to the backend API
        method: "GET",
        headers: {
          'Authorization': storedToken, // Include token in the request header
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setRole(data.role); // Set role based on the response
            
          } else {
            console.error("Failed to fetch role:", data.message);
          }
        })
        .catch(err => console.error("Error fetching role:", err));
    }
  }, []);

  return (
    <>
      {/* Show the LoginPopup if the login state is true */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className='headpart'>
        {/* Pass down login, token, and cart-related props to Navbar */}
        <Navbar 
          setShowLogin={setShowLogin} 
          token={token} 
          setToken={setToken} 
          cart={cart} 
          setCart={setCart} 
          role={role}
        />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/all-food' element={<Allfood cart={cart} setCart={setCart} />} />
          <Route path='/cart' element={<Cart cart={cart} setCart={setCart} />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/menu' element={<Header />} />

          {/* Only show the dashboard if the user has an admin role */}
          {role === "admin" && (
            <Route path='/dashboard' element={<Dashboard />} />
          )}
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
