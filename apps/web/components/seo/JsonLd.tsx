/**
 * Injeta JSON-LD (dados estruturados) — rich results no Google + ajuda as IAs
 * a entenderem o que o site é. Server component puro (só renderiza um <script>).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
