import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { motion, type Variants } from "framer-motion";
import vaidyaImage from "@/assets/vaidya-portrait.jpg";
import mandalaPattern from "@/assets/mandala-pattern.png";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
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

const About = () => {
  return (
    <Layout>
      <SEO 
        title="About TriSutra Ayurveda – Ancient Vedic Wisdom & Modern Wellness Heritage"
        description="Discover the story of TriSutra Ayurveda. Rooted in the three pillars of Vedic wellness (Hetu, Linga, Aushadha), we bring authentic Swarnprashan to modern families."
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "About", item: "/about" }
        ]}
        type="website"
        keywords="TriSutra Ayurveda history, Vedic wellness heritage, authentic Ayurvedic brand India, Hetu Linga Aushadha"
      />
      {/* Hero */}
      <section className="section-padding gradient-earth relative overflow-hidden">
        <img src={mandalaPattern} alt="" className="absolute right-0 top-0 w-96 h-96 opacity-10 translate-x-1/4 -translate-y-1/4" loading="lazy" width={800} height={800} />
        <motion.div
          className="container-custom relative text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Our Story</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">About TriSutra</h1>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            TriSutra is born from a deep reverence for Ayurveda — the science of life. We believe that ancient Indian wisdom holds the answers to modern wellness challenges.
          </p>
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">The Three Threads of Wellness</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              The name "TriSutra" derives from the three foundational threads (sutras) of Ayurvedic diagnosis described in classical texts — <em>Hetu</em> (cause), <em>Linga</em> (symptoms), and <em>Aushadha</em> (treatment).
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Founded with the vision of making authentic Ayurvedic practices accessible to every Indian family, TriSutra bridges the gap between ancient Vaidya wisdom and today's health-conscious parents.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Every product we create follows time-honored formulations, prepared under the guidance of experienced Ayurvedic practitioners using the highest quality herbs and minerals.
            </p>
          </motion.div>
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <img src={vaidyaImage} alt="Our Vaidya" className="rounded-lg shadow-xl w-full max-w-md mx-auto" loading="lazy" width={600} height={800} />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <motion.h2
            className="font-heading text-3xl sm:text-4xl font-bold text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            Our Values
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              { title: "Authenticity", description: "Every formulation is rooted in classical Ayurvedic texts. We never compromise on traditional preparation methods." },
              { title: "Purity", description: "We source the finest herbs, minerals, and ingredients. Each batch undergoes rigorous quality testing." },
              { title: "Trust", description: "Generations of families trust Ayurveda. We honor that trust with transparency in every product we make." },
            ].map((v, i) => (
              <motion.div key={i} variants={fadeUpChild} className="text-center">
                <h3 className="font-heading text-2xl font-semibold mb-4">{v.title}</h3>
                <p className="font-body text-sm opacity-80 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
