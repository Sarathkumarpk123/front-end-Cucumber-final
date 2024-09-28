import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Allfood.css';
import { CartContext } from '../CartContext';

export const Allfood = () => {
  const { cart, setCart } = useContext(CartContext); // Access cart and setCart
  const [vegFood, setVegFood] = useState([]);
  const [nonVegFood, setNonVegFood] = useState([]);

  const location = useLocation();
  const { restaurantName, restaurantCategory } = location.state || {};

  useEffect(() => {
    const url = restaurantCategory === "veg"
      ? 'https://entri-final-project-cucumber-backend.onrender.com/foods?vegOnly=true'
      : 'https://entri-final-project-cucumber-backend.onrender.com/foods?vegOnly=false';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        restaurantCategory === "veg" ? setVegFood(data) : setNonVegFood(data);
      })
      .catch(error => console.error('Error fetching food:', error));
  }, [restaurantCategory]);

  const handleAddToCart = (foodItem) => {
    const existingItem = cart.find(item => item._id === foodItem._id);

    if (existingItem) {
      setCart(cart.map(item =>
        item._id === foodItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...foodItem, quantity: 1 }]);
    }
    alert(`${foodItem.name} has been added to your cart!`);
  };

  const foodItems = restaurantCategory === "veg" ? vegFood : nonVegFood;

  return (
    <div>
      <h1>{restaurantCategory === "veg" ? "Veg Food" : "Non-Veg Food"}</h1>
      {restaurantName ? (
        <h2>Restaurant: {restaurantName}</h2>
      ) : (
        <p>No restaurant selected</p>
      )}

      <div className="food-list">
        {foodItems.length > 0 ? (
          foodItems.map((food) => (
            <div key={food._id} className="food-item">
              <img src={food.image} alt={food.name} className="food-image" />
              <div className="food-details">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p><strong>Price:</strong> ₹{food.price}</p>
                <button onClick={() => handleAddToCart(food)}>Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading food items...</p>
        )}
      </div>
    </div>
  );
};

export default Allfood;
