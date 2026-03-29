import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import productImage from "@/assets/swarnprashan-product.jpg";

const products = [
  { id: "swarnprashan", name: "Swarnprashan Drops", price: 999, originalPrice: 1299, image: productImage, category: "Immunity", badge: "Bestseller" },
  { id: "swarnprashan", name: "Swarnprashan — 3 Month Pack", price: 2697, originalPrice: 3897, image: productImage, category: "Immunity", badge: "Value Pack" },
  { id: "swarnprashan", name: "Swarnprashan Subscription", price: 899, originalPrice: 999, image: productImage, category: "Subscription", badge: "Monthly" },
];

const Shop = () => {
  return (
    <Layout>
      <section className="section-padding gradient-earth">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Our Collection</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Shop Ayurvedic Wellness</h1>
          <p className="font-body text-muted-foreground text-lg">Authentic, traditional formulations for your family's health.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={800} />
                  {p.badge && (
                    <span className="absolute top-4 left-4 bg-gold text-gold-foreground font-body text-xs font-semibold px-3 py-1 rounded">{p.badge}</span>
                  )}
                </div>
                <div className="p-6">
                  <p className="font-body text-xs text-secondary uppercase tracking-wider mb-1">{p.category}</p>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{p.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-heading text-xl font-bold text-foreground">₹{p.price}</span>
                    <span className="font-body text-sm text-muted-foreground line-through">₹{p.originalPrice}</span>
                  </div>
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body">
                    <Link to={`/product/${p.id}`}>View Product</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center bg-muted rounded-lg p-12">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3">More Products Coming Soon</h3>
            <p className="font-body text-muted-foreground mb-6">We're working on expanding our collection with more authentic Ayurvedic formulations.</p>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body">
              <Link to="/contact">Get Notified</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
