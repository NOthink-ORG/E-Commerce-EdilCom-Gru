import { categoryDirectory } from "@/lib/catalog-navigation";
import { CollectionHero, CategoryCard } from "@/components/collection-sections";
import { SearchBar } from "@/components/ui";
import { SupportBanner } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Categorie ricambi",
  "Esplora tutte le famiglie di ricambi per gru nel catalogo dimostrativo Edilcom Gru.",
  "/categorie",
);
export default function CategoriesPage() {
  return (
    <main id="contenuto">
      <CollectionHero
        title="Categorie ricambi"
        description="Esplora tutte le famiglie di ricambi per gru e attrezzature di sollevamento. Trova il componente giusto per le tue esigenze."
        items={[{ label: "Categorie" }]}
      />
      <div className="container catalog-search">
        <SearchBar />
      </div>
      <section className="container section directory-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Categorie ricambi</p>
            <h2>Tutte le categorie</h2>
          </div>
          <p className="muted">{categoryDirectory.length} categorie</p>
        </div>
        <div className="directory-grid">
          {categoryDirectory.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
      <SupportBanner />
    </main>
  );
}
