import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "product";
  schema?: Record<string, any>;
  keywords?: string;
  breadcrumbs?: { name: string; item: string }[];
  faq?: { question: string; answer: string }[];
}

const SEO = ({
  title = "TriSutra Ayurveda — Ayurvedic Immunity Drops for Kids | Swarnprashan",
  description = "Authentic Swarnprashan drops for kids immunity. TriSutra Ayurveda offers doctor-approved, natural wellness products for children's growth and health. Buy Swarnprashan online.",
  image = "/trisutra-logo.png",
  type = "website",
  schema,
  keywords = "Ayurveda, Swarnprashan, buy swarnprashan online, ayurvedic immunity drops for kids, children immunity, ayurvedic baby immunity booster india, ancient wisdom",
  breadcrumbs,
  faq,
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = "https://trisutra.online";
  const currentUrl = `${siteUrl}${location.pathname}`;

  const finalSchema = schema || {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TriSutra Ayurveda",
    "url": siteUrl,
    "logo": `${siteUrl}/trisutra-logo.png`,
    "description": "Authentic Ayurvedic wellness products emphasizing traditional wisdom.",
    "sameAs": [
      "https://instagram.com/_trisutra_"
    ]
  };

  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": `${siteUrl}${b.item}`
    }))
  } : null;

  const faqSchema = faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

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
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
