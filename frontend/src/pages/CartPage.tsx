import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { submitOrder } from "../api/orders";


const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    try {
      const simplifiedItems = cart.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
      }));
  
      await submitOrder("42", simplifiedItems);
  
      alert("✅ Order placed successfully!");
      clearCart();
    } catch (error) {
      alert("❌ Could not place order. Try again later.");
      console.error(error);
    }
  };
  

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.map(item => (
            <div
              key={item.itemId}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.price} RON
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.itemId)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-xl mt-2">
            Total: {total} RON
          </div>

          <button
            onClick={handleOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Submit Order
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
