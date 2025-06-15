import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import BarDashboard from "./pages/BarDashboard";
import TokenValidator from "./components/TokenValidator";
import InvalidTokenPage from "./pages/InvalidTokenPage";
import ScanQRPage from "./pages/ScanQRPage";
import { CartProvider } from "./context/CartContext";
import { SessionProvider } from "./context/SessionContext";
import { useSession } from "./context/SessionContext";

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isValid } = useSession();
  
  if (!isValid) {
    return <Navigate to="/scan-qr" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Token validation route */}
            <Route path="/:token" element={<TokenValidator />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            
            {/* Public routes */}
            <Route path="/bar" element={<BarDashboard />} />
            <Route path="/invalid-token" element={<InvalidTokenPage />} />
            <Route path="/scan-qr" element={<ScanQRPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </SessionProvider>
  );
}

export default App;
