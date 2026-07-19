import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import ProductPage from "@/pages/ProductPage";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading || user === null) return null;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/shop"} replace />;
  return <Landing />;
}

export default function App() {
  return (
    <div className="App">
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Toaster position="top-right" richColors />
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}
