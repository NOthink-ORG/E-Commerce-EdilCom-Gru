"use client";
import { X } from "lucide-react";
import { money, type Product } from "@/lib/catalog";
import type { CatalogScope } from "@/lib/catalog-navigation";
type FilterValues = {
  selectedCategories: string[];
  brands: string[];
  compatible: string[];
  available: boolean;
  min: number;
  max: number;
  voltage: string[];
  sliderMax: number;
};
export function CatalogFilters({
  source,
  scope,
  values,
  filteredCount,
  change,
  onReset,
  onClose,
  onPriceDraft,
  onPriceCommit,
}: {
  source: Product[];
  scope: CatalogScope;
  values: FilterValues;
  filteredCount: number;
  change: (key: string, value: string, multi?: boolean) => void;
  onReset: () => void;
  onClose: () => void;
  onPriceDraft: (value: number) => void;
  onPriceCommit: (value: string) => void;
}) {
  const {
    selectedCategories,
    brands,
    compatible,
    available,
    min,
    max,
    voltage,
    sliderMax,
  } = values;
  const allCategories = [...new Set(source.map((p) => p.category))];
  const allBrands = [...new Set(source.map((p) => p.brand))];
  function checkGroup(
    title: string,
    options: string[],
    key: string,
    chosen: string[],
    count: (p: Product, v: string) => boolean,
  ) {
    if (!options.length) return null;
    return (
      <fieldset>
        <legend>{title}</legend>
        {options.map((v) => (
          <label className="check-label" key={v}>
            <input
              type="checkbox"
              checked={chosen.includes(v)}
              onChange={() => change(key, v, true)}
            />
            <span>{v}</span>
            <small>({source.filter((p) => count(p, v)).length})</small>
          </label>
        ))}
      </fieldset>
    );
  }
  return (
    <>
      <div className="filter-heading">
        <h2>Filtri di ricerca</h2>
        <button className="text-button" onClick={() => onReset()}>
          Pulisci filtri
        </button>
        <button
          className="icon-button close-filters"
          onClick={() => onClose()}
          aria-label="Chiudi filtri"
        >
          <X size={19} />
        </button>
      </div>
      {!scope.category &&
        checkGroup(
          "Categoria",
          allCategories,
          "categoria",
          selectedCategories,
          (p, v) => p.category === v,
        )}
      {!scope.brand &&
        checkGroup(
          "Brand",
          allBrands,
          "brand",
          brands,
          (p, v) => p.brand === v,
        )}
      {checkGroup(
        "Compatibilità demo",
        [...new Set(source.flatMap((p) => p.compatibility))],
        "compatibilita",
        compatible,
        (p, v) => p.compatibility.includes(v),
      )}
      <fieldset>
        <legend>Disponibilità</legend>
        <label className="check-label">
          <input
            type="checkbox"
            checked={available}
            onChange={() => change("disponibile", available ? "" : "1")}
          />
          <span>Solo prodotti disponibili</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>Fascia prezzo</legend>
        <div className="price-inputs">
          <label>
            <span className="sr-only">Prezzo minimo</span>
            <input
              type="number"
              aria-label="Prezzo minimo"
              min={0}
              max={2000}
              value={min || ""}
              placeholder="Da €"
              onChange={(e) => change("min", e.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Prezzo massimo</span>
            <input
              type="number"
              aria-label="Prezzo massimo"
              min={0}
              max={2000}
              value={max}
              onChange={(e) => change("max", e.target.value)}
            />
          </label>
        </div>
        <input
          className="price-range"
          aria-label="Limite prezzo massimo"
          type="range"
          min={0}
          max={2000}
          step={1}
          value={sliderMax}
          onChange={(e) => onPriceDraft(Number(e.target.value))}
          onPointerUp={(e) => onPriceCommit(e.currentTarget.value)}
          onKeyUp={(e) => onPriceCommit(e.currentTarget.value)}
          onBlur={(e) => onPriceCommit(e.currentTarget.value)}
        />
        <small className="muted">Fino a {money(sliderMax)} · IVA esclusa</small>
      </fieldset>
      {checkGroup(
        "Tensione / alimentazione",
        [...new Set(source.flatMap((p) => (p.voltage ? [p.voltage] : [])))],
        "tensione",
        voltage,
        (p, v) => p.voltage === v,
      )}
      <button
        className="button primary apply-filters"
        onClick={() => onClose()}
      >
        Mostra {filteredCount} prodotti
      </button>
    </>
  );
}
