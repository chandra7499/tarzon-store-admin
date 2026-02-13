import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY, // 🔒 search-only key
);

export default searchClient;
