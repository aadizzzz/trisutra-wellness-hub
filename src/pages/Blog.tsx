import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { motion, type Variants } from "framer-motion";

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

const posts = [
  { slug: "what-is-swarnprashan", title: "What is Swarnprashan? A Complete Guide for Parents", category: "Child Health", date: "March 15, 2026", excerpt: "Learn about this ancient Ayurvedic immunization practice and how it can benefit your child's overall development." },
  { slug: "immunity-ayurveda", title: "5 Ayurvedic Ways to Boost Your Child's Immunity", category: "Immunity", date: "March 8, 2026", excerpt: "Natural and time-tested methods from Ayurveda to strengthen your child's immune system without any side effects." },
  { slug: "pushya-nakshatra", title: "Why Pushya Nakshatra is the Best Day for Swarnprashan", category: "Traditions", date: "February 28, 2026", excerpt: "Understanding the astrological and scientific significance of administering Swarnprashan on Pushya Nakshatra." },
  { slug: "ayurvedic-diet-children", title: "Ayurvedic Diet Guide for Growing Children", category: "Lifestyle", date: "February 20, 2026", excerpt: "A comprehensive guide to feeding your child according to Ayurvedic principles for optimal growth and health." },
  { slug: "gold-in-ayurveda", title: "The Role of Gold (Swarna) in Ayurvedic Medicine", category: "Knowledge", date: "February 12, 2026", excerpt: "Exploring how purified gold has been used in Ayurveda for thousands of years and its health benefits." },
  { slug: "seasonal-immunity", title: "Seasonal Immunity Tips from Ayurveda", category: "Immunity", date: "February 5, 2026", excerpt: "How to adjust your family's wellness routine according to Ritucharya (seasonal regimen) in Ayurveda." },
];

const categories = ["All", "Child Health", "Immunity", "Traditions", "Lifestyle", "Knowledge"];

const Blog = () => {
  return (
    <Layout>
      <SEO 
        title="Ayurvedic Health Blog | TriSutra Ayurveda"
        description="Insights, tips, and traditional wisdom on Ayurvedic health, child wellness, and Swarnprashan from our expert Vaidyas."
        type="website"
      />
      <section className="section-padding gradient-earth">
        <motion.div
          className="container-custom text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Knowledge & Wisdom</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Ayurveda Blog</h1>
          <p className="font-body text-muted-foreground text-lg">Insights on Ayurvedic health, child wellness, and traditional healing.</p>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            className="flex flex-wrap gap-3 mb-12 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            {categories.map((c) => (
              <button key={c} className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${c === "All" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                {c}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {posts.map((p) => (
              <motion.article key={p.slug} variants={fadeUpChild} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <span className="font-heading text-3xl text-muted-foreground/30">🌿</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-body text-xs text-secondary uppercase tracking-wider">{p.category}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-body text-xs text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3 line-clamp-2">{p.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
