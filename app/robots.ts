import type { MetadataRoute } from "next";

// A demo, not a product: nothing here should end up in search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
