import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'zod';

/**
 * Standalone recreation of the blog content schema from src/content.config.ts.
 * We recreate it here because the original uses Astro's defineCollection/glob
 * which cannot be imported in a plain Vitest context.
 */
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

// Feature: seo-metadata-system, Property 8: Blog content schema validation round-trip
describe('P8: Blog content schema validation round-trip', () => {
  // Generate valid dates that won't produce NaN — use integer timestamps
  const validDateArb = fc
    .integer({ min: 946684800000, max: 1924905600000 }) // 2000-01-01 to 2030-12-31
    .map((ts) => new Date(ts));

  const frontmatterArb = fc.record(
    {
      title: fc.string({ minLength: 1 }),
      description: fc.string({ minLength: 1 }),
      date: validDateArb,
      tags: fc.array(fc.string({ minLength: 1 }), { maxLength: 5 }),
      draft: fc.boolean(),
      image: fc.string({ minLength: 1 }),
      ogImage: fc.string({ minLength: 1 }),
      canonicalURL: fc.webUrl(),
    },
    {
      // Make optional fields truly optional by allowing them to be absent
      requiredKeys: ['title', 'description', 'date'],
    },
  );

  it('parses any valid frontmatter and preserves all provided values', () => {
    // Validates: Requirements 5.1, 5.2, 5.4
    fc.assert(
      fc.property(frontmatterArb, (input) => {
        const result = blogSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const data = result.data;

        // Required fields are always preserved
        expect(data.title).toBe(input.title);
        expect(data.description).toBe(input.description);
        expect(data.date.getTime()).toBe(new Date(input.date).getTime());

        // Optional fields: preserved when provided, defaults when absent
        if (input.tags !== undefined) {
          expect(data.tags).toEqual(input.tags);
        } else {
          expect(data.tags).toEqual([]);
        }

        if (input.draft !== undefined) {
          expect(data.draft).toBe(input.draft);
        } else {
          expect(data.draft).toBe(false);
        }

        if (input.image !== undefined) {
          expect(data.image).toBe(input.image);
        } else {
          expect(data.image).toBeUndefined();
        }

        if (input.ogImage !== undefined) {
          expect(data.ogImage).toBe(input.ogImage);
        } else {
          expect(data.ogImage).toBeUndefined();
        }

        if (input.canonicalURL !== undefined) {
          expect(data.canonicalURL).toBe(input.canonicalURL);
        } else {
          expect(data.canonicalURL).toBeUndefined();
        }
      }),
      { numRuns: 100 },
    );
  });
});
