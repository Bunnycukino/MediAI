import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: "WOMEN", to: "/shop?category=women" },
    { label: "MEN", to: "/shop?category=men" },
    { label: "ACCESSORIES", to: "/shop?category=accessories" },
    { label: "NEW IN", to: "/shop" },
  ];

  const isActive = (to) => (loc.pathname + loc.search) === to;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-black text-white text-center py-2 text-xs tracking-wider">
        FREE SHIPPING ON ORDERS OVER £100
      </div>
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo - Center on mobile, left on desktop */}
            <Link 
              to="/" 
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 text-xl tracking-[0.3em] font-light"
            >
              SHOP WITH STYLE
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 mx-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs tracking-[0.2em] transition-opacity ${
                    isActive(link.to) ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => nav("/profile")}
                  className="p-2 hover:opacity-60 transition-opacity"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => nav("/login")}
                  className="hidden md:block text-xs tracking-wider hover:opacity-60 transition-opacity"
                >
                  SIGN IN
                </button>
              )}
              
              <Link
                to="/cart"
                className="relative p-2 hover:opacity-60 transition-opacity"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-sm tracking-[0.2em] hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="px-6 py-3 text-sm tracking-wider block hover:bg-gray-50"
                    >
                      MY ACCOUNT
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="px-6 py-3 text-sm tracking-wider w-full text-left hover:bg-gray-50"
                    >
                      SIGN OUT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-6 py-3 text-sm tracking-wider block hover:bg-gray-50"
                  >
                    SIGN IN
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
