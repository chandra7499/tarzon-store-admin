export const runtime = "nodejs";

import algoliasearch from "algoliasearch";

export async function POST(req) {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  );

  const index = client.initIndex("products");

  return Response.json({ success: true });
}