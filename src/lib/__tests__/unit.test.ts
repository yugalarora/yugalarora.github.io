import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import {
  generateBlogPostingSchema,
  generateWebSiteSchema,
  generatePersonSchema,
} from '../schema';

// 10.1 — robots.txt content
describe('robots.txt', () => {
  const content = readFileSync(resolve('public/robots.txt'), 'utf-8');

  it('contains User-agent: *', () => {
    expect(content).toContain('User-agent: *');
  });

  it('contains Allow: /', () => {
    expect(content).toContain('Allow: /');
  });

  it('contains Disallow: /404', () => {
    expect(content).toContain('Disallow: /404');
  });

  it('contains Sitemap directive', () => {
    expect(content).toContain('Sitemap: https://yugalarora.com/sitemap-index.xml');
  });
});

// 10.2 — og-default.svg
describe('og-default.svg', () => {
  const content = readFileSync(resolve('public/og-default.svg'), 'utf-8');

  it('has width="1200" and height="630"', () => {
    expect(content).toContain('width="1200"');
    expect(content).toContain('height="630"');
  });

  it('has viewBox="0 0 1200 630"', () => {
    expect(content).toContain('viewBox="0 0 1200 630"');
  });

  it('contains the site name', () => {
    expect(content).toContain('yugalarora.com');
  });
});

// 10.3 — schema.ts edge cases
describe('schema.ts edge cases', () => {
  it('omits image and keywords when not provided', () => {
    const result = generateBlogPostingSchema({
      title: 'Test',
      description: 'A test post',
      datePublished: '2025-01-01T00:00:00Z',
      url: 'https://yugalarora.com/blog/test',
    });
    expect(result).not.toHaveProperty('image');
    expect(result).not.toHaveProperty('keywords');
  });

  it('omits keywords when tags is an empty array', () => {
    const result = generateBlogPostingSchema({
      title: 'Test',
      description: 'A test post',
      datePublished: '2025-01-01T00:00:00Z',
      url: 'https://yugalarora.com/blog/test',
      tags: [],
    });
    expect(result).not.toHaveProperty('keywords');
  });

  it('includes image when provided', () => {
    const result = generateBlogPostingSchema({
      title: 'Test',
      description: 'A test post',
      datePublished: '2025-01-01T00:00:00Z',
      url: 'https://yugalarora.com/blog/test',
      image: 'https://yugalarora.com/images/test.png',
    });
    expect(result.image).toBe('https://yugalarora.com/images/test.png');
  });

  it('includes keywords as comma-separated string when tags provided', () => {
    const result = generateBlogPostingSchema({
      title: 'Test',
      description: 'A test post',
      datePublished: '2025-01-01T00:00:00Z',
      url: 'https://yugalarora.com/blog/test',
      tags: ['go', 'linux'],
    });
    expect(result.keywords).toBe('go, linux');
  });

  it('generateWebSiteSchema returns valid structure with empty strings', () => {
    const result = generateWebSiteSchema('', '', '');
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('WebSite');
    expect(result.name).toBe('');
    expect(result.url).toBe('');
    expect(result.description).toBe('');
  });

  it('generatePersonSchema returns valid structure with empty sameAs', () => {
    const result = generatePersonSchema('Name', 'https://example.com', 'Engineer', []);
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Person');
    expect(result.sameAs).toEqual([]);
  });
});

// 10.4 — content schema rejects missing required fields
describe('content schema rejects missing required fields', () => {
  const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  });

  it('rejects missing title', () => {
    const result = blogSchema.safeParse({
      description: 'A post',
      date: '2025-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing description', () => {
    const result = blogSchema.safeParse({
      title: 'Hello',
      date: '2025-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing date', () => {
    const result = blogSchema.safeParse({
      title: 'Hello',
      description: 'A post',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid minimal frontmatter', () => {
    const result = blogSchema.safeParse({
      title: 'Hello',
      description: 'A post',
      date: '2025-01-01',
    });
    expect(result.success).toBe(true);
  });
});
