import Layout from "@/components/Layout";
import vaidyaImage from "@/assets/vaidya-portrait.jpg";
import mandalaPattern from "@/assets/mandala-pattern.png";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding gradient-earth relative overflow-hidden">
        <img src={mandalaPattern} alt="" className="absolute right-0 top-0 w-96 h-96 opacity-10 translate-x-1/4 -translate-y-1/4" loading="lazy" width={800} height={800} />
        <div className="container-custom relative text-center max-w-3xl mx-auto">
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Our Story</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">About TriSutra</h1>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            TriSutra is born from a deep reverence for Ayurveda — the science of life. We believe that ancient Indian wisdom holds the answers to modern wellness challenges.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
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
          </div>
          <div className="relative">
            <img src={vaidyaImage} alt="Our Vaidya" className="rounded-lg shadow-xl w-full max-w-md mx-auto" loading="lazy" width={600} height={800} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Authenticity", description: "Every formulation is rooted in classical Ayurvedic texts. We never compromise on traditional preparation methods." },
              { title: "Purity", description: "We source the finest herbs, minerals, and ingredients. Each batch undergoes rigorous quality testing." },
              { title: "Trust", description: "Generations of families trust Ayurveda. We honor that trust with transparency in every product we make." },
            ].map((v, i) => (
              <div key={i} className="text-center">
                <h3 className="font-heading text-2xl font-semibold mb-4">{v.title}</h3>
                <p className="font-body text-sm opacity-80 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
