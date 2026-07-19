import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: "Sklep", to: "/shop" },
    { label: "Bluzy", to: "/shop?category=bluzy" },
    { label: "T-shirty", to: "/shop?category=tshirty" },
    { label: "Spodnie", to: "/shop?category=spodnie" },
    { label: "Sukienki", to: "/shop?category=sukienki" },
  ];

  const linkCls = (to) =>
    `text-sm tracking-wide transition-colors ${
      loc.pathname + loc.search === to
        ? "text-[#1A2E25] font-medium"
        : "text-[#5C6A64] hover:text-[#1A2E25]"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-xl border-b border-[#E1DFDA]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#1A2E25] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" strokeWidth={1.8} />
          </div>
          <div className="leading-tight">
            <div className="font-heading text-lg text-[#1A2E25]">SusStyle</div>
          </div>
        </Link>

        {/* NAV LINKS - desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls(l.to)}>{l.label}</Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#E1DFDA] transition-colors">
            <Search className="w-4 h-4 text-[#5C6A64]" />
          </button>

          {/* CART */}
          <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#E1DFDA] transition-colors">
            <ShoppingBag className="w-4 h-4 text-[#1A2E25]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1A2E25] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden md:flex items-center gap-1.5 text-sm text-[#5C6A64] hover:text-[#1A2E25] transition-colors">
                <UserIcon className="w-4 h-4" />
                <span>{user.name?.split(" ")[0]}</span>
              </Link>
              <button onClick={logout} className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#E1DFDA] transition-colors">
                <LogOut className="w-4 h-4 text-[#5C6A64]" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-[#5C6A64] hover:text-[#1A2E25]">
                <Link to="/login">Zaloguj</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-[#1A2E25] text-white hover:bg-[#2D4A3E]">
                <Link to="/register">Konto</Link>
              </Button>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#E1DFDA] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-[#F9F8F6] border-t border-[#E1DFDA] px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="text-sm text-[#1A2E25] py-2 border-b border-[#E1DFDA] last:border-0">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-[#1A2E25] py-2">Konto</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-sm text-left text-red-500 py-2">Wyloguj</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
                <Link to="/login" onClick={() => setMenuOpen(false)}>Zaloguj</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 rounded-full bg-[#1A2E25] text-white">
                <Link to="/register" onClick={() => setMenuOpen(false)}>Konto</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
