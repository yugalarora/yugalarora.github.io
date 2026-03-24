/**
 * SEO utility helpers extracted for testability.
 */

const SITE_NAME = 'yugalarora.com';
const SITE_URL = 'https://yugalarora.com';
const DEFAULT_OG_IMAGE = '/og-default.svg';

/**
 * Formats a page title with the site name suffix.
 * P1: For any non-empty title, returns "{title} | yugalarora.com".
 */
export function formatTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

/**
 * Resolves the canonical URL for a page.
 * P3: If override is provided, use it. Otherwise, build from pathname + siteUrl.
 */
export function resolveCanonicalUrl(
  pathname: string,
  siteUrl: string,
  override?: string,
): string {
  if (override) {
    return override;
  }
  return new URL(pathname, siteUrl).href;
}

/**
 * Resolves which OG image path to use.
 * P4: ogImage > image > "/og-default.svg"
 * Returns the path (not absolute URL).
 */
export function resolveOgImage(ogImage?: string, image?: string): string {
  if (ogImage) {
    return ogImage;
  }
  if (image) {
    return image;
  }
  return DEFAULT_OG_IMAGE;
}

/**
 * Resolves a relative path to an absolute URL.
 */
export function resolveAbsoluteUrl(path: string, siteUrl: string): string {
  return new URL(path, siteUrl).href;
}
