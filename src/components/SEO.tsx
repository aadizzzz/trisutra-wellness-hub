import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "product";
  schema?: Record<string, any>;
  keywords?: string;
}

const SEO = ({
  title = "TriSutra Ayurveda — Ancient Wisdom, Modern Wellness",
  description = "TriSutra Ayurveda offers authentic Swarnprashan and traditional Ayurvedic wellness products for children's immunity, growth, and overall health.",
  image = "/trisutra-logo.png",
  type = "website",
  schema,
  keywords = "Ayurveda, Swarnprashan, children immunity, ayurvedic wellness, ancient wisdom",
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = "https://tri-sutra.com"; // Replace with actual domain if known
  const currentUrl = `${siteUrl}${location.pathname}`;

  // Base Schema for Organization
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TriSutra Ayurveda",
    url: siteUrl,
    logo: `${siteUrl}/trisutra-logo.png`,
    description: "Authentic Ayurvedic wellness products emphasizing traditional wisdom.",
  };

  const finalSchema = schema || baseSchema;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph Tags */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
