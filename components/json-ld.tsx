/**
 * Renders a JSON-LD structured-data block. The `<` escape follows the
 * Next.js JSON-LD guidance: JSON.stringify does not neutralize a "<" that could
 * break out of the <script> context, so we replace it before injection.
 * This is a Server Component — JSON-LD is data, not executable code, so a native
 * <script> tag (not next/script) is correct.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
