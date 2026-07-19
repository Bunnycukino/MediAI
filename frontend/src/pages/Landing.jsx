import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, RotateCcw, Star, ArrowRight, Sparkles, Shield, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const HERO_IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80";

const CATEGORIES = [
  { name: "Bluzy", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80", slug: "bluzy" },
  { name: "T-shirty", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", slug: "tshirty" },
  { name: "Spodnie", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", slug: "spodnie" },
  { name: "Sukienki", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", slug: "sukienki" },
];

const FEATURED = [
  { id: 1, name: "Bluza Oversize", price: 149, img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80", badge: "Bestseller" },
  { id: 2, name: "T-shirt Klasyczny", price: 79, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", badge: "Nowość" },
  { id: 3, name: "Spodnie Cargo", price: 199, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", badge: null },
  { id: 4, name: "Sukienka Midi", price: 229, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80", badge: "Promocja" },
];

export default function Landing() {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden h-[85vh] min-h-[500px]">
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center top" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur border border-white/30 text-xs uppercase tracking-[0.2em] text-white mb-6">
                <Sparkles className="w-3 h-3" /> Nowa kolekcja 2026
              </span>
              <h1 className="font-heading font-light text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6">
                Styl, który
                <span className="block italic font-normal text-[#C9B99A] mt-2">mówi za Ciebie</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-md">
                Odkryj kolekcję ubrań stworzonych z myślą o komforcie i nowoczesnym stylu. Szybka dostawa do Manchesteru i całej Europy.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full bg-white text-[#1A2E25] hover:bg-[#C9B99A] hover:text-white px-8 h-14 text-base font-medium transition-all">
                  <Link to="/shop">Przeglądaj kolekcję <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-[#1A2E25] px-8 h-14 text-base">
                  <Link to="/register">Załóż konto</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-[#1A2E25] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8">
          {[
            { icon: Truck, text: "Darmowa dostawa od 200 zł" },
            { icon: RotateCcw, text: "30 dni na zwrot" },
            { icon: Shield, text: "Bezpieczna płatność" },
            { icon: Tag, text: "Ceny bez kompromisów" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4 text-[#C9B99A]" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <h2 className="text-3xl font-heading font-light text-[#1A2E25] mb-2">Kategorie</h2>
        <p className="text-[#5C6A64] mb-10">Znajdź swój styl w naszych kolekcjach</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-square">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white font-medium text-lg">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-heading font-light text-[#1A2E25] mb-2">Polecane produkty</h2>
              <p className="text-[#5C6A64]">Najpopularniejsze w tym sezonie</p>
            </div>
            <Link to="/shop" className="text-sm text-[#1A2E25] hover:text-[#8BA888] flex items-center gap-1 transition-colors">
              Zobacz wszystkie <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#1A2E25] text-white text-xs px-2 py-1 rounded-full">{product.badge}</span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => addToCart({ ...product, quantity: 1, size: "M" })}
                      className="w-full rounded-full bg-white text-[#1A2E25] hover:bg-[#1A2E25] hover:text-white text-sm"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" /> Dodaj do koszyka
                    </Button>
                  </div>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-[#1A2E25] group-hover:text-[#8BA888] transition-colors">{product.name}</h3>
                  <p className="text-[#5C6A64] mt-1">{product.price} zł</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <h2 className="text-3xl font-heading font-light text-[#1A2E25] mb-2 text-center">Opinie klientów</h2>
        <p className="text-[#5C6A64] text-center mb-12">Ponad 2000 zadowolonych klientów</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ania K.", text: "Świetna jakość, szybka dostawa. Na pewno wrócę!", stars: 5 },
            { name: "Maciej W.", text: "Bluzy oversize są dokładnie takie jak na zdjęciach. Polecam!", stars: 5 },
            { name: "Zofia P.", text: "Super obsługa i piękne ubrania. Zamówiłam już 3 razy.", stars: 5 },
          ].map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-6 border border-[#E1DFDA]">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C9B99A] text-[#C9B99A]" />
                ))}
              </div>
              <p className="text-[#5C6A64] leading-relaxed mb-4">"{r.text}"</p>
              <p className="font-medium text-[#1A2E25] text-sm">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="bg-[#1A2E25] text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-light mb-4">Dołącz do SusStyle</h2>
          <p className="text-white/70 text-lg mb-8">Załóż konto i otrzymaj 10% zniżki na pierwsze zamówienie.</p>
          <Button asChild size="lg" className="rounded-full bg-[#C9B99A] text-[#1A2E25] hover:bg-white px-10 h-14 text-base font-medium">
            <Link to="/register">Zarejestruj się teraz <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F9F8F6] border-t border-[#E1DFDA] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#5C6A64]">
          SusStyle © 2026 • Manchester, UK • kontakt@susstyle.com
        </div>
      </footer>
    </div>
  );
}
