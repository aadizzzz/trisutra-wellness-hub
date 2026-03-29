import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Zap, Baby, Calendar, CheckCircle } from "lucide-react";
import productImage from "@/assets/swarnprashan-product.jpg";

const ingredients = [
  "Swarna Bhasma (Gold Ash)",
  "Brahmi Ghrit (Medicated Ghee)",
  "Vacha (Acorus calamus)",
  "Shankhpushpi (Convolvulus pluricaulis)",
  "Raw Forest Honey",
  "Pippali (Long Pepper)",
];

const usageSteps = [
  "Administered on Pushya Nakshatra day (monthly)",
  "2-4 drops for infants, 4-8 drops for children",
  "Place drops directly on the tongue",
  "Best given on an empty stomach in the morning",
  "Continue for minimum 6 months for best results",
];

const ProductDetail = () => {
  return (
    <Layout>
      {/* Product Hero */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img src={productImage} alt="Swarnprashan Drops" className="rounded-lg shadow-2xl w-full max-w-lg mx-auto" width={800} height={800} />
          </div>
          <div>
            <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-2">TriSutra Ayurveda</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Swarnprashan Drops</h1>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              An ancient Ayurvedic immunization practice from Kashyap Samhita, designed to enhance immunity, intellect, and overall growth in children from birth to 16 years.
            </p>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-heading text-3xl font-bold text-foreground">₹999</span>
              <span className="font-body text-sm text-muted-foreground line-through">₹1,299</span>
              <span className="font-body text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Save 23%</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-body font-semibold px-10">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body px-10">
                <Calendar className="w-4 h-4 mr-2" /> Subscribe Monthly
              </Button>
            </div>
            <p className="font-body text-xs text-muted-foreground">Free shipping on orders above ₹500 • Administered on Pushya Nakshatra</p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">Key Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Immunity", desc: "Builds a robust immune system naturally" },
              { icon: Brain, title: "Intellect", desc: "Sharpens memory and cognitive function" },
              { icon: Zap, title: "Digestion", desc: "Improves digestive fire (Agni)" },
              { icon: Baby, title: "Growth", desc: "Supports overall physical development" },
            ].map((b, i) => (
              <div key={i} className="bg-card rounded-lg p-6 text-center border border-border">
                <b.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients & Usage */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Ingredients</h2>
            <ul className="space-y-4">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 font-body text-foreground">
                  <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">How to Use</h2>
            <ul className="space-y-4">
              {usageSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-foreground">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container-custom">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Start Your Child's Golden Immunity Today</h2>
          <p className="font-body opacity-80 mb-8 max-w-xl mx-auto">Subscribe for monthly Swarnprashan and never miss a Pushya Nakshatra day.</p>
          <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-body font-semibold px-10">
            Subscribe Now — ₹899/month
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
