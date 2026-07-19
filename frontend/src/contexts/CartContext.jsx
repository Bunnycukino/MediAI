import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("susstyle_cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("susstyle_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.size === product.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === product.size
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
