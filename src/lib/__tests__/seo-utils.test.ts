import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  formatTitle,
  resolveCanonicalUrl,
  resolveOgImage,
  resolveAbsoluteUrl,
} from '../seo-utils';

const SITE_URL = 'https://yugalarora.com';

// Feature: seo-metadata-system, Property 1: Title tag formatting
describe('P1: Title tag formatting', () => {
  it('formats any non-empty title as "{title} | yugalarora.com"', () => {
    // Validates: Requirements 3.2
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const result = formatTitle(title);
        expect(result).toBe(`${title} | yugalarora.com`);
      }),
      { numRuns: 100 },
    );
  });
});

// Feature: seo-metadata-system, Property 3: Canonical URL resolution
describe('P3: Canonical URL resolution', () => {
  it('produces an absolute URL starting with the site URL for any path', () => {
    // Validates: Requirements 3.4, 5.6
    const pathArb = fc
      .array(fc.stringMatching(/^[a-z0-9-]+$/), { minLength: 1, maxLength: 5 })
      .map((segments) => '/' + segments.join('/'));

    fc.assert(
      fc.property(pathArb, (pathname) => {
        const result = resolveCanonicalUrl(pathname, SITE_URL);
        expect(result).toMatch(/^https:\/\/yugalarora\.com/);
        expect(result).toContain(pathname);
      }),
      { numRuns: 100 },
    );
  });

  it('uses the override value when provided', () => {
    // Validates: Requirements 3.4, 5.6
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.webUrl(),
        (pathname, override) => {
          const result = resolveCanonicalUrl(pathname, SITE_URL, override);
          expect(result).toBe(override);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: seo-metadata-system, Property 4: OG image resolution chain
describe('P4: OG image resolution chain', () => {
  const imagePathArb = fc
    .stringMatching(/^[a-z0-9-]+$/)
    .map((s) => `/images/${s}.png`);

  it('uses ogImage when provided', () => {
    // Validates: Requirements 3.7, 3.8, 5.5, 6.4, 6.5, 6.6, 6.7
    fc.assert(
      fc.property(
        imagePathArb,
        fc.option(imagePathArb, { nil: undefined }),
        (ogImage, image) => {
          const result = resolveOgImage(ogImage, image);
          expect(result).toBe(ogImage);

          const absolute = resolveAbsoluteUrl(result, SITE_URL);
          expect(absolute).toMatch(/^https:\/\/yugalarora\.com/);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('falls back to image when ogImage is absent', () => {
    // Validates: Requirements 3.7, 3.8, 6.6
    fc.assert(
      fc.property(imagePathArb, (image) => {
        const result = resolveOgImage(undefined, image);
        expect(result).toBe(image);

        const absolute = resolveAbsoluteUrl(result, SITE_URL);
        expect(absolute).toMatch(/^https:\/\/yugalarora\.com/);
      }),
      { numRuns: 100 },
    );
  });

  it('falls back to /og-default.svg when both are absent', () => {
    // Validates: Requirements 3.7, 6.4
    const result = resolveOgImage(undefined, undefined);
    expect(result).toBe('/og-default.svg');

    const absolute = resolveAbsoluteUrl(result, SITE_URL);
    expect(absolute).toBe('https://yugalarora.com/og-default.svg');
  });

  it('always resolves to an absolute URL starting with the site URL', () => {
    // Validates: Requirements 6.7
    fc.assert(
      fc.property(
        fc.option(imagePathArb, { nil: undefined }),
        fc.option(imagePathArb, { nil: undefined }),
        (ogImage, image) => {
          const resolved = resolveOgImage(ogImage, image);
          const absolute = resolveAbsoluteUrl(resolved, SITE_URL);
          expect(absolute).toMatch(/^https:\/\/yugalarora\.com/);
        },
      ),
      { numRuns: 100 },
    );
  });
});
