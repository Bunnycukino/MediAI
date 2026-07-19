import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Star, Truck, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ALL_PRODUCTS = [
  { id: 1, name: "Bluza Oversize Czarna", price: 149, category: "bluzy", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&q=80", badge: "Bestseller", sizes: ["XS","S","M","L","XL"], desc: "Klasyczna bluza oversize z miekkiej bawelny. Idealna na kazda okazje - do szkoły, na spacer lub do domu. Dostepna w kilku kolorach." },
  { id: 2, name: "Bluza Oversize Szara", price: 149, category: "bluzy", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80", badge: null, sizes: ["XS","S","M","L"], desc: "Szara bluza oversize - ponadczasowy klasyk do kazdej stylizacji. Wykonana z wysokiej jakosci materialu." },
  { id: 3, name: "T-shirt Klasyczny Bialy", price: 79, category: "tshirty", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80", badge: "Nowosc", sizes: ["XS","S","M","L","XL","XXL"], desc: "Bialy t-shirt z organicznej bawelny. Minimalistyczny design, doskonala jakosc materialu, wygodny krot." },
  { id: 4, name: "T-shirt Graficzny", price: 89, category: "tshirty", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=700&q=80", badge: null, sizes: ["S","M","L","XL"], desc: "T-shirt z unikalnym nadrukiem graficznym. Wyrozniaj sie z tłumu i wyrazaj swoj styl." },
  { id: 5, name: "Spodnie Cargo Zielone", price: 199, category: "spodnie", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=80", badge: null, sizes: ["XS","S","M","L","XL"], desc: "Spodnie cargo w modnym zielonym kolorze. Wiele kieszeni, komfortowy material, idealne na co dzien." },
  { id: 6, name: "Spodnie Dresowe", price: 129, category: "spodnie", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=80", badge: "Promocja", sizes: ["S","M","L","XL","XXL"], desc: "Wygodne spodnie dresowe z miekkiego materialu. Doskonale na trening lub relaks w domu." },
  { id: 7, name: "Sukienka Midi Kremowa", price: 229, category: "sukienki", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=80", badge: null, sizes: ["XS","S","M","L"], desc: "Elegancka sukienka midi w kremowym kolorze. Idealna na wesele, kolacje lub spotkanie biznesowe." },
  { id: 8, name: "Sukienka Mini Czarna", price: 189, category: "sukienki", img: "https://images.unsplash.com/photo-1566479179817-08bbf3f0f92f?w=700&q=80", badge: "Nowosc", sizes: ["XS","S","M","L"], desc: "Ponadczasowa czarna sukienka mini. Klasyk w kazdej garderobie, ktory pasuje do kazdej okazji." },
];

export default function ProductPage() {
  const { id } = useParams();
  const product = ALL_PRODUCTS.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-2xl font-heading text-[#1A2E25] mb-4">Produkt nie znaleziony</h2>
          <Button asChild className="rounded-full bg-[#1A2E25] text-white">
            <Link to="/shop">Wróc do sklepu</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({ ...product, size: selectedSize, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#5C6A64] hover:text-[#1A2E25] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Wróc do sklepu
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* IMAGE */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#1A2E25] text-white text-sm px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            <div className="mb-2">
              <Link to={`/shop?category=${product.category}`} className="text-sm text-[#8BA888] capitalize hover:underline">
                {product.category}
              </Link>
            </div>
            <h1 className="text-3xl font-heading font-light text-[#1A2E25] mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-[#C9B99A] text-[#C9B99A]" />)}
              </div>
              <span className="text-sm text-[#5C6A64]">(24 opinie)</span>
            </div>

            <p className="text-3xl font-medium text-[#1A2E25] mb-6">{product.price} zl</p>

            <p className="text-[#5C6A64] leading-relaxed mb-8">{product.desc}</p>

            {/* SIZES */}
            <div className="mb-6">
              <p className="text-sm font-medium text-[#1A2E25] mb-3">Rozmiar: {selectedSize && <span className="text-[#8BA888]">{selectedSize}</span>}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full text-sm font-medium border-2 transition-all ${
                      selectedSize === size
                        ? "border-[#1A2E25] bg-[#1A2E25] text-white"
                        : "border-[#E1DFDA] text-[#5C6A64] hover:border-[#1A2E25]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`rounded-full h-14 text-base font-medium transition-all ${
                added
                  ? "bg-[#8BA888] text-white"
                  : "bg-[#1A2E25] text-white hover:bg-[#2D4A3E] disabled:opacity-40"
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {added ? "Dodano do koszyka!" : selectedSize ? "Dodaj do koszyka" : "Wybierz rozmiar"}
            </Button>

            {/* TRUST */}
            <div className="mt-6 pt-6 border-t border-[#E1DFDA] space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#5C6A64]">
                <Truck className="w-4 h-4 text-[#8BA888]" />
                <span>Darmowa dostawa od 200 zl</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#5C6A64]">
                <RotateCcw className="w-4 h-4 text-[#8BA888]" />
                <span>30 dni na bezplatny zwrot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
