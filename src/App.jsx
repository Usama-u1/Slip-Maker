import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

function App() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState(''); 
  const [cart, setCart] = useState([]);

  const dishes = [
    { name: 'Pizza', price: 1400 },
    { name: 'Burger', price: 300 },
    { name: 'Pasta', price: 600 },
    { name: 'Sushi', price: 2000 },
    { name: 'Tacos', price: 500 },
    { name: 'Salad', price: 100 },
    { name: 'Steak', price: 2500 },
    { name: 'Sandwich', price: 150 },
    { name: 'Soup', price: 180 },
    { name: 'Fries', price: 100 },
    { name: 'Curry', price: 250 },
    { name: 'Biryani', price: 700 }
  ];

  const handleDishSelect = (dish) => {
    setCart((prevCart) => {
      const existingDish = prevCart.find((item) => item.name === dish.name);
      if (existingDish) {
        return prevCart.map((item) =>
          item.name === dish.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...dish, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (dishName, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === dishName ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150], 
    });
  
    doc.setDrawColor(0); 
    doc.rect(5, 5, 70, 140); 
  
    doc.setFontSize(14);
    doc.setFont('bold');
    doc.text(' Receipt', 40, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('normal');
    doc.text(`Customer Name: ${name}`, 10, 25);
    doc.text(`Token Number: ${number}`, 10, 30);
  
    let y = 40;
    doc.setFillColor(230, 230, 230); 
    doc.rect(10, y, 60, 6, 'F'); 
    doc.setFontSize(10);
    doc.setFont('bold');
    doc.text('Qty', 12, y + 4);
    doc.text('Item', 35, y + 4);
    doc.text('Price', 60, y + 4);
  
    y += 10;
    doc.setFont('normal');
    cart.forEach((item) => {
      doc.text(`${item.quantity}`, 12, y);
      doc.text(`${item.name}`, 35, y);
      doc.text(`Rs ${item.price * item.quantity}`, 60, y);
      y += 6;
    });
  
    doc.setDrawColor(0);
    doc.line(10, y, 70, y); 
    y += 6;
  
    doc.setFont('bold');
    doc.text(`Total: Rs ${calculateTotal()}`, 10, y);
    y += 6;
    doc.text(`Amount Paid: Rs ${amount}`, 10, y);
    y += 6;
    doc.text(`Change: Rs ${amount - calculateTotal()}`, 10, y);
  
    y += 10;
    doc.setFontSize(9);
    doc.setFont('italic');
    doc.setTextColor(100);
    doc.text('Thank you for your visit!', 40, y, { align: 'center' });
  
    doc.save('receipt.pdf');
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Slip Maker</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-72"
        />
        <input
          type="text"
          placeholder="Enter your number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-72"
        />
        <input
          type="text"
          placeholder="Recived Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-72"
        />
      </div>

      <div className="flex flex-wrap gap-6 justify-center w-full">
        <div className="grid grid-cols-3 gap-4 bg-white shadow-md p-4 rounded-md">
          {dishes.map((dish, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handleDishSelect(dish)}
                className="py-2 px-4 text-white font-medium rounded-md transition bg-blue-500 hover:bg-blue-600"
              >
                {dish.name}
              </button>
              <p className="text-sm mt-1 text-gray-700">Rs {dish.price}</p>
            </div>
          ))}
        </div>

        <div className="w-96 bg-white shadow-md rounded-md p-4 flex flex-col">
          <h2 className="text-xl font-bold text-center mb-2">Self Receipt</h2>
          <div className="grid grid-cols-3 gap-2 border-b-2 pb-2 mb-2 text-center font-semibold">
            <p>Quantity</p>
            <p>Item</p>
            <p>Price</p>
          </div>
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="grid grid-cols-3 items-center text-center mb-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.name, -1)}
                    className="px-2 py-0.5 bg-red-500 text-white rounded-md font-bold"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.name, 1)}
                    className="px-2 py-0.5 bg-green-500 text-white rounded-md font-bold"
                  >
                    +
                  </button>
                </div>
                <span>{item.name}</span>
                <span>Rs {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold text-center">Total: Rs {calculateTotal()}</h3>
        </div>
      </div>

      <button
        onClick={handleGeneratePDF}
        className="mt-6 py-2 px-6 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
      >
        Generate Slip
      </button>
    </div>
  );
}

export default App;
