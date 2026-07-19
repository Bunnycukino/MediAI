import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#E1DFDA] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-[#5C6A64]" />
          </div>
          <h2 className="text-2xl font-heading font-light text-[#1A2E25] mb-3">Koszyk jest pusty</h2>
          <p className="text-[#5C6A64] mb-8">Dodaj produkty do koszyka, aby kontynuowac zakupy.</p>
          <Button asChild className="rounded-full bg-[#1A2E25] text-white hover:bg-[#2D4A3E] px-8">
            <Link to="/shop">Przejdz do sklepu <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <h1 className="text-4xl font-heading font-light text-[#1A2E25] mb-8">Koszyk</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="bg-white rounded-2xl p-4 flex gap-4 border border-[#E1DFDA]">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#1A2E25] leading-tight">{item.name}</h3>
                      <p className="text-sm text-[#5C6A64] mt-0.5">Rozmiar: {item.size}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-[#5C6A64] hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-[#F9F8F6] rounded-full px-3 py-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="text-[#5C6A64] hover:text-[#1A2E25]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium text-[#1A2E25] w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="text-[#5C6A64] hover:text-[#1A2E25]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-medium text-[#1A2E25]">{item.price * item.quantity} zl</p>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-sm text-[#5C6A64] hover:text-red-500 transition-colors"
            >
              Wyczysc koszyk
            </button>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-[#E1DFDA] sticky top-24">
              <h2 className="font-heading text-xl text-[#1A2E25] mb-6">Podsumowanie</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6A64]">Produkty</span>
                  <span className="text-[#1A2E25]">{cartTotal} zl</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6A64]">Dostawa</span>
                  <span className="text-[#8BA888]">{cartTotal >= 200 ? "Gratis" : "15 zl"}</span>
                </div>
                <div className="border-t border-[#E1DFDA] pt-3 flex justify-between font-medium">
                  <span className="text-[#1A2E25]">Razem</span>
                  <span className="text-[#1A2E25] text-lg">
                    {cartTotal >= 200 ? cartTotal : cartTotal + 15} zl
                  </span>
                </div>
              </div>
              {cartTotal < 200 && (
                <p className="text-xs text-[#8BA888] bg-[#F0F5EF] rounded-xl p-3 mb-4">
                  Dodaj jeszcze {200 - cartTotal} zl, aby otrzymac darmowa dostawe!
                </p>
              )}
              <Button className="w-full rounded-full bg-[#1A2E25] text-white hover:bg-[#2D4A3E] h-12">
                Przejdz do kasy <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button asChild variant="ghost" className="w-full rounded-full mt-2 text-[#5C6A64]">
                <Link to="/shop">Kontynuuj zakupy</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
