import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Zara-inspired imagery: editorial, high-fashion photography
const HERO_IMG = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=90";

const CATEGORIES = [
  { name: "WOMEN", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90", slug: "women" },
  { name: "MEN", img: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=90", slug: "men" },
  { name: "ACCESSORIES", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=90", slug: "accessories" },
  { name: "COLLECTION", img: "https://images.unsplash.com/photo-1558769132-cb1aea8f5c7c?w=800&q=90", slug: "collection" },
];

const FEATURED = [
  { id: 1, name: "Oversized Blazer", price: 279, img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=90" },
  { id: 2, name: "Linen Shirt", price: 129, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=90" },
  { id: 3, name: "Wide Leg Trousers", price: 189, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=90" },
  { id: 4, name: "Cashmere Knit", price: 249, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=90" },
];

export default function Landing() {
  const { addToCart } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* HERO - Full bleed editorial */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-end pb-24">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-md">
              <p className="text-white text-xs tracking-[0.3em] uppercase mb-4">Spring 2026</p>
              <h1 className="text-white text-6xl md:text-7xl font-light leading-tight mb-8">
                Shop With Style
              </h1>
              <Button 
                asChild 
                className="bg-white text-black hover:bg-gray-100 px-8 h-12 text-sm tracking-wide uppercase rounded-none"
              >
                <Link to="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-0">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="absolute inset-0 flex items-end p-6">
                <h3 className="text-white text-sm tracking-[0.2em] uppercase font-light">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-baseline justify-between mb-16">
            <h2 className="text-3xl font-light tracking-tight">New Arrivals</h2>
            <Link 
              to="/shop" 
              className="text-xs uppercase tracking-wider hover:opacity-60 transition flex items-center gap-2"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {FEATURED.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-light">{product.name}</h3>
                    <p className="text-sm font-light">£{product.price}</p>
                  </div>
                </Link>
                <Button
                  onClick={() => addToCart({ ...product, quantity: 1, size: "M" })}
                  variant="outline"
                  className="w-full mt-3 rounded-none border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                >
                  Add to Bag
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section 
        className="relative h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90)" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-2xl px-8">
            <p className="text-white text-xs tracking-[0.3em] uppercase mb-4">Limited Edition</p>
            <h2 className="text-white text-5xl font-light leading-tight mb-8">
              Curated for You
            </h2>
            <Button 
              asChild
              className="bg-white text-black hover:bg-gray-100 px-8 h-12 text-sm tracking-wide uppercase rounded-none"
            >
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-light mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8 font-light">
            Sign up for exclusive offers, original stories, events and more.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 h-12 border border-gray-300 rounded-none focus:outline-none focus:border-black text-sm"
            />
            <Button className="bg-black text-white hover:bg-gray-800 px-8 h-12 rounded-none text-xs uppercase tracking-wider">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4 font-medium">Shop</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><Link to="/shop?category=women" className="hover:opacity-60">Women</Link></li>
                <li><Link to="/shop?category=men" className="hover:opacity-60">Men</Link></li>
                <li><Link to="/shop?category=accessories" className="hover:opacity-60">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4 font-medium">Company</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><Link to="/about" className="hover:opacity-60">About</Link></li>
                <li><Link to="/contact" className="hover:opacity-60">Contact</Link></li>
                <li><Link to="/careers" className="hover:opacity-60">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4 font-medium">Help</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><Link to="/faq" className="hover:opacity-60">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:opacity-60">Shipping</Link></li>
                <li><Link to="/returns" className="hover:opacity-60">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4 font-medium">Legal</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><Link to="/privacy" className="hover:opacity-60">Privacy</Link></li>
                <li><Link to="/terms" className="hover:opacity-60">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 font-light tracking-wide">
              © 2026 Shop With Style. Manchester, United Kingdom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
