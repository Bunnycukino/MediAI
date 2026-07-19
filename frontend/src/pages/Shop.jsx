import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ALL_PRODUCTS = [
  { id: 1, name: "Bluza Oversize Czarna", price: 149, category: "bluzy", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80", badge: "Bestseller", sizes: ["XS","S","M","L","XL"] },
  { id: 2, name: "Bluza Oversize Szara", price: 149, category: "bluzy", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80", badge: null, sizes: ["XS","S","M","L"] },
  { id: 3, name: "T-shirt Klasyczny Bialy", price: 79, category: "tshirty", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", badge: "Nowosc", sizes: ["XS","S","M","L","XL","XXL"] },
  { id: 4, name: "T-shirt Graficzny", price: 89, category: "tshirty", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80", badge: null, sizes: ["S","M","L","XL"] },
  { id: 5, name: "Spodnie Cargo Zielone", price: 199, category: "spodnie", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80", badge: null, sizes: ["XS","S","M","L","XL"] },
  { id: 6, name: "Spodnie Dresowe", price: 129, category: "spodnie", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", badge: "Promocja", sizes: ["S","M","L","XL","XXL"] },
  { id: 7, name: "Sukienka Midi Kremowa", price: 229, category: "sukienki", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80", badge: null, sizes: ["XS","S","M","L"] },
  { id: 8, name: "Sukienka Mini Czarna", price: 189, category: "sukienki", img: "https://images.unsplash.com/photo-1566479179817-08bbf3f0f92f?w=500&q=80", badge: "Nowosc", sizes: ["XS","S","M","L"] },
];

const CATEGORIES = [
  { slug: "all", label: "Wszystkie" },
  { slug: "bluzy", label: "Bluzy" },
  { slug: "tshirty", label: "T-shirty" },
  { slug: "spodnie", label: "Spodnie" },
  { slug: "sukienki", label: "Sukienki" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") || "all";
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const filtered = useMemo(() =>
    activeCategory === "all"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const handleAdd = (product) => {
    addToCart({ ...product, size: product.sizes[1] || product.sizes[0], quantity: 1 });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-6">
        <h1 className="text-4xl font-heading font-light text-[#1A2E25] mb-1">Sklep</h1>
        <p className="text-[#5C6A64]">{filtered.length} produkt{filtered.length === 1 ? '' : filtered.length < 5 ? 'y' : 'ow'}</p>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setParams(cat.slug === "all" ? {} : { category: cat.slug })}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === cat.slug
                  ? "bg-[#1A2E25] text-white"
                  : "bg-white border border-[#E1DFDA] text-[#5C6A64] hover:border-[#1A2E25] hover:text-[#1A2E25]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#1A2E25] text-white text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handleAdd(product)}
                    className={`w-full rounded-full text-sm transition-all ${
                      addedId === product.id
                        ? "bg-[#8BA888] text-white"
                        : "bg-white text-[#1A2E25] hover:bg-[#1A2E25] hover:text-white"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {addedId === product.id ? "Dodano!" : "Dodaj do koszyka"}
                  </Button>
                </div>
              </div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-medium text-[#1A2E25] text-sm leading-tight group-hover:text-[#8BA888] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#5C6A64] mt-1 text-sm">{product.price} zl</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
