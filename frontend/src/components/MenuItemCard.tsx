import React from "react";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../context/CartContext";

type Props = {
  item: {
    id: string;
    name: string;
    price: number;
    description?: string;
  };
};

const MenuItemCard: React.FC<Props> = ({ item }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    const newItem: CartItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    };
    addToCart(newItem);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{item.name}</h2>
      <p className="text-gray-600 text-sm">{item.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-blue-600 font-bold">{item.price} RON</span>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
