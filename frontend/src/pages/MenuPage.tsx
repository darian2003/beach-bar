import React, { useEffect, useState } from "react";
import MenuItemCard from "../components/MenuItemCard";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface MenuItem {
  id: number;
  nume: string;
  pret_lei: number;
  categorie: string;
  cantitate_ml: number;
  descriere: string;
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Top Cart Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/cart"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <ShoppingCart className="w-5 h-5" />
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">🏖️ Beach Menu</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading menu...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
