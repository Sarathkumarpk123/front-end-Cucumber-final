import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Image from '../../assets/placeholder.png';
import Logout from '../../assets/logout.png';
import Menu from '../../assets/menu.png';
import { CartContext } from '../CartContext'; // Import CartContext
import SamImage from '../../assets/sam.png';
const Navbar = ({ setShowLogin, token, setToken, role }) => {
    const [menubar, setMenubar] = useState("home");
    const [showDropdown, setShowDropdown] = useState(false);

    const { cart } = useContext(CartContext); // Access the cart from CartContext
    const navigate = useNavigate();
    
    const handleCartClick = () => {
        navigate('/cart');
    };
    
    const handleLogoClick = () => {
        navigate('/');
    };

    const handleMenuClick = (menu) => {
        setMenubar(menu);
        if (menu === "home") {
            navigate('/');
        } else if (menu === "menu") {
            navigate('/menu');
        } else if (menu === "about") {
            navigate('/about');
        } else if (menu === "dashboard") { // Correct path for dashboard
            navigate('/dashboard');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate('/');
    };

    const handleSignin = () => {
        setShowLogin(true);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className='navbar'>
            <h1  onClick={handleLogoClick}>Cucumber</h1>
            <ul className='navbar-menu'>
                <li onClick={() => handleMenuClick("home")} className={menubar === "home" ? "active" : ""}>Home</li>
                <li onClick={() => handleMenuClick("menu")} className={menubar === "menu" ? "active" : ""}>Menu</li>
                <li onClick={() => handleMenuClick("about")} className={menubar === "about" ? "active" : ""}>About</li>
              { role ==="admin" &&  <li onClick={() => handleMenuClick("dashboard")} className={menubar === "dashboard" ? "active" : ""}>Dashboard</li> }         
                  </ul>
            <div className='navbar-right'>
               
                <span onClick={handleCartClick} className="material-symbols-outlined">
                    shopping_cart
                    {/* Display the number of items in the cart */}
                    {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                </span>
                {!token ? (
                    <button className='navbar-button' onClick={handleSignin}>Sign in</button>
                ) : (
                    <div className='navbar-profile'>
                        {role === "admin" ?<img className='imageprofile' src={SamImage} alt="Profile" onClick={toggleDropdown} /> :
                        <img className='imageprofile' src={Image} alt="Profile" onClick={toggleDropdown} />}
                        {showDropdown && (
                            <ul className='nav-profile-dropdown'>
                                                               
                                <li onClick={handleLogout}><img className='imageicon' src={Logout} alt="Logout" /></li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
