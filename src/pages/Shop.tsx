import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import productImage from "@/assets/swarnprashan-product.jpg";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpChild: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const products = [
  { id: "swarnprashan", name: "Swarnprashan Drops", price: 999, originalPrice: 1299, image: productImage, category: "Immunity", badge: "Bestseller" },
  { id: "swarnprashan", name: "Swarnprashan — 3 Month Pack", price: 2697, originalPrice: 3897, image: productImage, category: "Immunity", badge: "Value Pack" },
  { id: "swarnprashan", name: "Swarnprashan Subscription", price: 899, originalPrice: 999, image: productImage, category: "Subscription", badge: "Monthly" },
];

const Shop = () => {
  const { addItem } = useCart();

  return (
    <Layout>
      <SEO 
        title="Shop Swarnprashan & Ayurvedic Health Products Online | TriSutra"
        description="Browse our collection of authentic Ayurvedic health solutions. Buy Swarnprashan drops online for your family's immunity, growth, and overall wellness. Best prices guaranteed."
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Shop", item: "/shop" }
        ]}
        type="website"
        keywords="buy swarnprashan online, ayurvedic immunity booster for kids shop, TriSutra shop, authentic ayurveda products india"
      />
      <section className="section-padding gradient-earth">
        <motion.div
          className="container-custom text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Our Collection</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Shop Ayurvedic Wellness</h1>
          <p className="font-body text-muted-foreground text-lg">Authentic, traditional formulations for your family's health.</p>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {products.map((p, i) => (
              <motion.div key={i} variants={fadeUpChild} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
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
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90 font-body"
                      onClick={() => {
                        addItem({ 
                          id: p.name.toLowerCase().replace(/\s+/g, '-'), 
                          name: p.name, 
                          price: p.price, 
                          image: p.image,
                          category: p.category 
                        });
                        toast.success(`${p.name} added to cart!`);
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button asChild variant="outline" className="flex-1 font-body">
                      <Link to={`/product/${p.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-20 text-center bg-muted rounded-lg p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3">More Products Coming Soon</h3>
            <p className="font-body text-muted-foreground mb-6">We're working on expanding our collection with more authentic Ayurvedic formulations.</p>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body">
              <Link to="/contact">Get Notified</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
