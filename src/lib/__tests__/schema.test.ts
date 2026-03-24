import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateWebSiteSchema,
  generatePersonSchema,
  generateBlogPostingSchema,
  type BlogPostingInput,
} from '../schema';

// Feature: seo-metadata-system, Property 5: WebSite JSON-LD structure
describe('P5: WebSite JSON-LD structure', () => {
  it('generates valid WebSite schema for any site name, URL, and description', () => {
    // Validates: Requirements 4.1, 4.7
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (siteName, siteUrl, description) => {
          const result = generateWebSiteSchema(siteUrl, siteName, description);

          expect(result['@context']).toBe('https://schema.org');
          expect(result['@type']).toBe('WebSite');
          expect(result.name).toBe(siteName);
          expect(result.url).toBe(siteUrl);
          expect(result.description).toBe(description);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: seo-metadata-system, Property 6: Person JSON-LD structure
describe('P6: Person JSON-LD structure', () => {
  it('generates valid Person schema for any name, URL, jobTitle, and sameAs array', () => {
    // Validates: Requirements 4.2, 4.7
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.array(fc.webUrl()),
        (name, url, jobTitle, sameAs) => {
          const result = generatePersonSchema(name, url, jobTitle, sameAs);

          expect(result['@context']).toBe('https://schema.org');
          expect(result['@type']).toBe('Person');
          expect(result.name).toBe(name);
          expect(result.url).toBe(url);
          expect(result.jobTitle).toBe(jobTitle);
          expect(result.sameAs).toEqual(sameAs);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: seo-metadata-system, Property 7: BlogPosting JSON-LD structure
describe('P7: BlogPosting JSON-LD structure', () => {
  // Use integer timestamps to avoid invalid Date values from fc.date()
  const validDateArb = fc
    .integer({ min: 946684800000, max: 1924905600000 }) // 2000-01-01 to 2030-12-31
    .map((ts) => new Date(ts).toISOString());

  const blogPostingInputArb = fc.record({
    title: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 1 }),
    datePublished: validDateArb,
    url: fc.webUrl(),
    image: fc.option(fc.webUrl(), { nil: undefined }),
    tags: fc.option(fc.array(fc.string({ minLength: 1 })), { nil: undefined }),
  }) as fc.Arbitrary<BlogPostingInput>;

  it('generates valid BlogPosting schema with correct base fields', () => {
    // Validates: Requirements 4.3, 4.4, 4.5, 4.7
    fc.assert(
      fc.property(blogPostingInputArb, (input) => {
        const result = generateBlogPostingSchema(input);

        expect(result['@context']).toBe('https://schema.org');
        expect(result['@type']).toBe('BlogPosting');
        expect(result.headline).toBe(input.title);
        expect(result.description).toBe(input.description);
        expect(result.datePublished).toBe(input.datePublished);
        expect(result.url).toBe(input.url);
        expect(result.author).toEqual({
          '@type': 'Person',
          name: 'Yugal Arora',
          url: 'https://yugalarora.com',
        });
      }),
      { numRuns: 100 },
    );
  });

  it('includes image when provided, omits when not', () => {
    // Validates: Requirements 4.4, 4.7
    fc.assert(
      fc.property(blogPostingInputArb, (input) => {
        const result = generateBlogPostingSchema(input);

        if (input.image) {
          expect(result.image).toBe(input.image);
        } else {
          expect(result).not.toHaveProperty('image');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('includes keywords as comma-separated string when tags is non-empty, omits otherwise', () => {
    // Validates: Requirements 4.5, 4.7
    fc.assert(
      fc.property(blogPostingInputArb, (input) => {
        const result = generateBlogPostingSchema(input);

        if (input.tags && input.tags.length > 0) {
          expect(result.keywords).toBe(input.tags.join(', '));
        } else {
          expect(result).not.toHaveProperty('keywords');
        }
      }),
      { numRuns: 100 },
    );
  });
});
