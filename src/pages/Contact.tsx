import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from("contact_messages")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO 
        title="Contact TriSutra Ayurveda | We're Here to Help"
        description="Reach out to TriSutra Ayurveda for questions about Swarnprashan, Ayurvedic consultations, and wellness products."
        type="website"
      />
      <section className="section-padding gradient-earth">
        <motion.div
          className="container-custom text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">Get in Touch</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="font-body text-muted-foreground text-lg">Have questions about Swarnprashan or our products? We're here to help.</p>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideInLeft}
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Send a Message</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  placeholder="Your Name" 
                  className="font-body bg-card" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  className="font-body bg-card" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <Input 
                placeholder="Subject" 
                className="font-body bg-card" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                disabled={isSubmitting}
              />
              <Textarea 
                placeholder="Your message..." 
                rows={5} 
                className="font-body bg-card" 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold px-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideInRight}
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Reach Us Directly</h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Clinic Address", value: "TriSutra Ayurveda Clinic\n123 Wellness Street, Andheri West\nMumbai, Maharashtra 400058" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                { icon: Mail, label: "Email", value: "trisutra06@gmail.com" },
              ].map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="font-body text-sm text-muted-foreground whitespace-pre-line">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-body font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
