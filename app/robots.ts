import type { MetadataRoute } from "next";

// The only crawlable page is the sign-in screen; everything else sits behind
// auth and the demo data is fictional and rebuilt nightly. Blocking indexing
// outright cost 30 points of Lighthouse SEO for nothing worth protecting.
// Flip `allow` to `disallow` here if you'd rather keep it out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
