export interface BlogPostingInput {
  title: string;
  description: string;
  datePublished: string;
  url: string;
  image?: string;
  tags?: string[];
}

export function generateWebSiteSchema(
  siteUrl: string,
  siteName: string,
  description: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description,
  };
}

export function generatePersonSchema(
  name: string,
  url: string,
  jobTitle: string,
  sameAs: string[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    jobTitle,
    sameAs,
  };
}

export function generateBlogPostingSchema(
  input: BlogPostingInput,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    author: {
      "@type": "Person",
      name: "Yugal Arora",
      url: "https://yugalarora.com",
    },
    url: input.url,
  };

  if (input.image) {
    schema.image = input.image;
  }

  if (input.tags && input.tags.length > 0) {
    schema.keywords = input.tags.join(", ");
  }

  return schema;
}
