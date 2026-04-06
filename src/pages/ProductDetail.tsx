import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Zap, Baby, Calendar, CheckCircle } from "lucide-react";
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
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpChild: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

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
  const { addItem } = useCart();

  return (
    <Layout>
      <SEO 
        title="Swarnprashan Drops – Ayurvedic Immunity Booster for Kids | TriSutra"
        description="Boost your child's immunity with natural, Ayurvedic Swarnprashan drops. Safe, doctor-approved immunity booster for kids aged 0-16 years. Buy online today."
        type="product"
        image="https://trisutra.online/swarnprashan-product.jpg"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Shop", item: "/shop" },
          { name: "Swarnprashan Drops", item: "/product/swarnprashan" }
        ]}
        faq={[
          { question: "What is Swarnprashan?", answer: "Swarnprashan is an ancient Ayurvedic immunization practice using purified gold ash, honey, and medicated ghee to boost children's immunity and intellect." },
          { question: "Is Swarnprashan safe for newborns?", answer: "Yes, Swarnprashan can be administered from birth up to 16 years of age under the guidance of a Vaidya." },
          { question: "When is the best time to give Swarnprashan?", answer: "While it can be given daily, it is most effective when administered on Pushya Nakshatra days every month." }
        ]}
        schema={{
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "TriSutra Swarnprashan Drops",
          "image": "https://trisutra.online/swarnprashan-product.jpg",
          "description": "An ancient Ayurvedic immunization practice designed to enhance immunity, intellect, and overall growth in children from birth to 16 years.",
          "brand": {
            "@type": "Brand",
            "name": "TriSutra Ayurveda"
          },
          "offers": {
            "@type": "Offer",
            "url": "https://trisutra.online/product/swarnprashan",
            "priceCurrency": "INR",
            "price": "999",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "128"
          }
        }}
      />
      {/* Product Hero */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
          >
            <img src={productImage} alt="TriSutra Swarnprashan Golden Immunity Drops for Kids" className="rounded-lg shadow-2xl w-full max-w-lg mx-auto" width={800} height={800} />
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
          >
            <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-2">TriSutra Ayurveda</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Swarnprashan Drops</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((s) => <CheckCircle key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm font-body text-muted-foreground">(4.9/5 based on 128 reviews)</span>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              An ancient Ayurvedic immunization practice from Kashyap Samhita, designed to enhance immunity, intellect, and overall growth in children from birth to 16 years.
            </p>
            <div className="flex items-baseline gap-4 mb-2">
              <span className="font-heading text-3xl font-bold text-foreground">₹999</span>
              <span className="font-body text-sm text-muted-foreground line-through">₹1,299</span>
              <span className="font-body text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Save 23%</span>
            </div>
            <p className="text-destructive font-body text-sm font-medium mb-6 flex items-center gap-1.5 animate-pulse">
              <Zap className="w-4 h-4" /> Only 12 left in stock – order soon!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                size="lg" 
                className="bg-gold text-gold-foreground hover:bg-gold/90 font-body font-semibold px-10"
                onClick={() => {
                  addItem({ id: "swarnprashan", name: "Swarnprashan Drops", price: 999, image: productImage });
                  toast.success("Swarnprashan Drops added to cart!");
                }}
              >
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body px-10">
                <Calendar className="w-4 h-4 mr-2" /> Subscribe Monthly
              </Button>
            </div>
            <p className="font-body text-xs text-muted-foreground">Free shipping on orders above ₹500 • Administered on Pushya Nakshatra</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <motion.h2
            className="font-heading text-3xl font-bold text-foreground text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            Key Benefits
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              { icon: Shield, title: "Immunity", desc: "Builds a robust immune system naturally" },
              { icon: Brain, title: "Intellect", desc: "Sharpens memory and cognitive function" },
              { icon: Zap, title: "Digestion", desc: "Improves digestive fire (Agni)" },
              { icon: Baby, title: "Growth", desc: "Supports overall physical development" },
            ].map((b, i) => (
              <motion.div key={i} variants={fadeUpChild} className="bg-card rounded-lg p-6 text-center border border-border">
                <b.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ingredients & Usage */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Ingredients</h2>
            <ul className="space-y-4">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 font-body text-foreground">
                  <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">How to Use</h2>
            <ul className="space-y-4">
              {usageSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-foreground">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="bg-muted py-12">
        <div className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Expert Vaidyas", desc: "Formulated by certified Ayurvedic doctors" },
            { title: "Traditional Prep", desc: "Aged for 21 days as per Kashyap Samhita" },
            { title: "Pushya Nakshatra", desc: "Batch-prepared on auspicious days only" },
            { title: "Pure Gold Ash", desc: "Laboratory tested Swarna Bhasma" },
          ].map((trust, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-foreground">{trust.title}</h4>
              <p className="font-body text-xs text-muted-foreground mt-1">{trust.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-gold">
                  {[1, 2, 3, 4, 5].map((s) => <CheckCircle key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="font-body text-foreground font-semibold">4.9 out of 5</span>
                <span className="text-muted-foreground">• 128 Verified Ratings</span>
              </div>
            </div>
            <Button variant="outline" className="border-primary text-primary">Write a Review</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", rating: 5, date: "2 days ago", comment: "I've been giving TriSutra Swarnprashan to my 3-year-old for 6 months. Her recurrent colds have completely stopped!" },
              { name: "Anish Gupta", rating: 5, date: "1 week ago", comment: "The quality is much better than other brands I've tried. Ordering process was seamless and delivery was fast." },
              { name: "Meera Reddy", rating: 4, date: "2 weeks ago", comment: "Excellent results. My son's focus and digestion have improved significantly. Definitely recommended." },
            ].map((review, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-heading font-semibold text-foreground">{review.name}</h5>
                    <div className="flex text-gold mb-1">
                      {[1, 2, 3, 4, 5].map((s) => <CheckCircle key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : 'text-muted'}`} />)}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">{review.date}</span>
                </div>
                <p className="font-body text-sm text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "What is Swarnprashan?", a: "Swarnprashan is an ancient Ayurvedic immunization practice using purified gold ash (Swarna Bhasma), medicated ghee, and honey. It is specifically formulated to enhance a child's immunity, memory, and physical growth." },
              { q: "At what age should I start giving it to my child?", a: "Ayurvedic texts like Kashyap Samhita recommend starting Swarnprashan from birth up to 16 years of age. It is most beneficial during the vital growth years." },
              { q: "Are there any side effects?", a: "TriSutra Swarnprashan is 100% natural and prepared by expert Vaidyas using traditional purification methods. It is safe, non-toxic, and has no recorded side effects when given in the recommended dosage." },
              { q: "Why is it given on Pushya Nakshatra?", a: "Pushya Nakshatra is considered an auspicious day in Ayurveda when the potency of herbs and gold ash is at its peak. Administering it on this day ensures maximum absorption and efficacy." },
            ].map((faq, i) => (
              <div key={i} className="bg-background p-6 rounded-lg border border-border">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="section-padding bg-primary text-primary-foreground text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container-custom">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Start Your Child's Golden Immunity Today</h2>
          <p className="font-body opacity-80 mb-8 max-w-xl mx-auto">Subscribe for monthly Swarnprashan and never miss a Pushya Nakshatra day.</p>
          <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-body font-semibold px-10">
            Subscribe Now — ₹899/month
          </Button>
        </div>
      </motion.section>
    </Layout>
  );
};

export default ProductDetail;
