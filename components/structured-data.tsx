import { siteConfig } from "@/lib/site";

export interface PersonSchemaProps {
  name: string;
  url: string;
  description: string;
  image?: string;
  sameAs?: string[];
}

export function PersonSchema({
  name,
  url,
  description,
  image,
  sameAs,
}: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    description,
    ...(image && { image }),
    ...(sameAs && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface WebSiteSchemaProps {
  name: string;
  url: string;
  description: string;
}

export function WebSiteSchema({ name, url, description }: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/blog?tag={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
  authorUrl: string;
  image?: string;
  tags?: string[];
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  author,
  authorUrl,
  image,
  tags,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Person",
      name: author,
      url: authorUrl,
    },
    publisher: {
      "@type": "Person",
      name: author,
      url: authorUrl,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(tags && { keywords: tags.join(", ") }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Convenience component for homepage
export function HomePageStructuredData() {
  return (
    <>
      <PersonSchema
        name="Beto Juarez III"
        url={siteConfig.url}
        description={siteConfig.description}
        sameAs={[
          "https://twitter.com/betoiii",
          "https://github.com/betojuarez",
          "https://linkedin.com/in/betojuarez",
        ]}
      />
      <WebSiteSchema
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
      />
    </>
  );
}
