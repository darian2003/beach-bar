import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import BarDashboard from "./pages/BarDashboard";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/bar" element={<BarDashboard />} /> 
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
