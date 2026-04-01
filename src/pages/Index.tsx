import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Sparkles, Star, Leaf, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-swarnprashan.jpg";
import productImage from "@/assets/swarnprashan-product.jpg";
import mandalaPattern from "@/assets/mandala-pattern.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const benefits = [
  { icon: Shield, title: "Boosts Immunity", description: "Strengthens your child's natural defense system with the power of Swarna Bhasma and Ayurvedic herbs." },
  { icon: Heart, title: "Enhances Memory", description: "Improves cognitive function, concentration, and learning ability in growing children." },
  { icon: Sparkles, title: "Physical Growth", description: "Supports overall physical development and strength as described in ancient Ayurvedic texts." },
  { icon: Leaf, title: "Natural & Safe", description: "100% natural ingredients prepared following authentic Vedic formulations with no side effects." },
  { icon: Droplets, title: "Easy to Administer", description: "Simple drops format — easy for children of all ages from newborn to 16 years." },
  { icon: Star, title: "Time-Tested", description: "A practice recommended by Maharshi Kashyap over 2,500 years ago in Kashyap Samhita." },
];

const testimonials = [
  { name: "Priya Sharma", location: "Mumbai", text: "My daughter's immunity has improved remarkably since we started Swarnprashan. She falls sick much less often now.", rating: 5 },
  { name: "Rajesh Patel", location: "Ahmedabad", text: "As a parent, finding authentic Ayurvedic care was important. TriSutra's quality and tradition gave us confidence.", rating: 5 },
  { name: "Anita Desai", location: "Pune", text: "The monthly subscription is so convenient. We never miss a dose and the results speak for themselves.", rating: 5 },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Swarnprashan Ayurvedic Wellness" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="relative container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p variants={fadeUpChild} className="font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">Ancient Wisdom • Modern Wellness</motion.p>
            <motion.h1 variants={fadeUpChild} className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              The Gift of <span className="text-gradient-gold">Golden</span> Immunity
            </motion.h1>
            <motion.p variants={fadeUpChild} className="font-body text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              Swarnprashan — a 2,500-year-old Ayurvedic immunization practice that strengthens your child's body, mind, and spirit naturally.
            </motion.p>
            <motion.div variants={fadeUpChild} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-body font-semibold text-base px-8">
                <Link to="/product/swarnprashan">Explore Swarnprashan</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground bg-primary-foreground/15 hover:bg-primary-foreground/25 font-body text-base px-8">
                <Link to="/shop">Visit Shop</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding relative overflow-hidden">
        <img src={mandalaPattern} alt="" className="absolute right-0 top-0 w-72 h-72 opacity-10 -translate-y-1/4 translate-x-1/4" loading="lazy" width={800} height={800} />
        <motion.div
          className="container-custom text-center max-w-3xl mx-auto relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">The TriSutra Way</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Rooted in Tradition, Refined by Care
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            TriSutra draws from the three pillars (Tri-Sutra) of Ayurveda — <em>Hetu</em> (cause), <em>Linga</em> (symptoms), and <em>Aushadha</em> (treatment) — to bring you wellness solutions that honor ancient knowledge while embracing modern quality standards.
          </p>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Why Swarnprashan</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Benefits for Your Child</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {benefits.map((b, i) => (
              <motion.div key={i} variants={fadeUpChild} className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <b.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{b.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Highlight */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInLeft}
            >
              <img src={productImage} alt="Swarnprashan Product" className="rounded-lg shadow-2xl w-full max-w-md mx-auto" loading="lazy" width={800} height={800} />
              <img src={mandalaPattern} alt="" className="absolute -bottom-8 -left-8 w-40 h-40 opacity-15 -z-10" loading="lazy" width={800} height={800} />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInRight}
            >
              <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Our Signature Product</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">Swarnprashan Drops</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Prepared with Swarna Bhasma (gold ash), pure honey, and Brahmi ghee, our Swarnprashan follows the exact formulation described in <em>Kashyap Samhita</em>. Each batch is crafted by experienced Vaidyas under strict quality controls.
              </p>
              <ul className="space-y-3 mb-8">
                {["Pure Swarna Bhasma (Gold Ash)", "Brahmi Ghrit (Clarified Butter)", "Vacha, Shankh Pushpi & Medicinal Herbs", "Raw Forest Honey"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-body text-sm text-foreground">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold px-8">
                <Link to="/product/swarnprashan">View Product Details</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="font-body text-sm tracking-[0.2em] uppercase opacity-70 mb-3">Testimonials</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Trusted by Parents Across India</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUpChild} className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-8 border border-primary-foreground/10">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-body text-sm leading-relaxed opacity-90 mb-6">"{t.text}"</p>
                <div>
                  <p className="font-body font-semibold text-sm">{t.name}</p>
                  <p className="font-body text-xs opacity-60">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="section-padding text-center relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <img src={mandalaPattern} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5" loading="lazy" width={800} height={800} />
        <div className="container-custom relative">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Begin Your Child's Wellness Journey
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Subscribe for monthly Swarnprashan and give your child the timeless gift of Ayurvedic immunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-body font-semibold text-base px-10">
              <Link to="/product/swarnprashan">Order Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body text-base px-10">
              <Link to="/contact">Talk to a Vaidya</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;
