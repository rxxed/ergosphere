// +page.js or +page.server.js
export function load({ params }) {
  return {
    slug: params.slug,
  };
}
