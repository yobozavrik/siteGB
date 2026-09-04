import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: object | object[];
}

const SITE_URL = "https://kratea-official.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const SEO = ({ title, description, path, image, type = "website", jsonLd }: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image || DEFAULT_IMAGE;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="uk-UA" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <meta property="og:locale" content="uk_UA" />
      <meta property="og:site_name" content="KRATEA" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
