import test from "node:test";
import assert from "node:assert/strict";
import { catalogRequest } from "../lib/catalog-request.ts";
import {
  categoryDirectory,
  brandDirectory,
} from "../lib/catalog-navigation.ts";
import { catalogProvider } from "../lib/catalog.ts";

// Run against `next start`, not next dev: SEO_TEST_BASE=http://localhost:3100 npm test.
// For a configured deployment, also set SEO_TEST_SITE_URL to its canonical origin/path.
const base = process.env.SEO_TEST_BASE?.replace(/\/$/, "");
const origin = process.env.SEO_TEST_SITE_URL?.replace(/\/$/, "");
const stripScripts = (html: string) =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
const decode = (text: string) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');

test(
  "HTML di produzione: contenuto navigabile, metadata e stati HTTP reali",
  { skip: !base },
  async (t) => {
    const prefix = new URL(base!).pathname.replace(/\/$/, "");
    async function read(path: string) {
      const response = await fetch(`${base}${path}`);
      const html = await response.text();
      assert.match(
        response.headers.get("x-robots-tag") || "",
        /noindex, nofollow/,
      );
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.doesNotMatch(html, /"@type":"(?:Product|Offer)"/);
      if (!origin) assert.doesNotMatch(html, /rel="canonical"/);
      else {
        for (const match of html.matchAll(/rel="canonical" href="([^"]+)"/g))
          assert.ok(
            decode(match[1]).startsWith(origin),
            `${path}: ${match[1]}`,
          );
      }
      if (origin && response.status === 200 && !path.includes("?")) {
        assert.ok(
          html.includes(`rel="canonical" href="${origin}${path}"`),
          `self canonical: ${path}`,
        );
      }
      assert.doesNotMatch(html, /<link[^>]*rel="canonical"[^>]*localhost/);
      return { response, html, content: stripScripts(html) };
    }
    await t.test(
      "principali route, un H1, esclusione demo e nessun prodotto commerciale JSON-LD",
      async () => {
        for (const path of [
          "/",
          "/catalogo",
          "/categorie",
          "/brand",
          "/carrello",
          "/checkout",
          "/assistenza",
        ]) {
          const { response, content } = await read(path);
          assert.equal(response.status, 200, path);
          assert.equal((content.match(/<h1\b/g) || []).length, 1, path);
        }
      },
    );
    await t.test(
      "prodotti, codici e paginazione presenti senza eseguire JavaScript",
      async () => {
        const cases = [
          { path: "/catalogo?pagina=2", params: { pagina: "2" }, scope: {} },
          {
            path: "/catalogo?brand=HBC&ordine=price-asc",
            params: { brand: "HBC", ordine: "price-asc" },
            scope: {},
          },
          {
            path: "/categorie/radiocomandi?pagina=2",
            params: { pagina: "2" },
            scope: { category: "Radiocomandi" },
          },
          {
            path: "/brand/hetronic?pagina=2",
            params: { pagina: "2" },
            scope: { brand: "Hetronic" },
          },
        ];
        for (const item of cases) {
          const { response, content } = await read(item.path);
          assert.equal(response.status, 200);
          assert.doesNotMatch(
            content,
            /hidden id="S:|Caricamento catalogo|Caricamento prodotti/,
          );
          for (const product of catalogRequest(item.params, item.scope).result
            .visible) {
            assert.ok(
              content.includes(`href="${prefix}/prodotti/${product.slug}"`),
              product.slug,
            );
            assert.ok(content.includes(product.code), product.code);
          }
        }
        const { content } = await read("/catalogo?pagina=2");
        assert.match(
          content,
          /<a[^>]*aria-current="page"[^>]*href="[^"]*pagina=2"/,
        );
        const match = [...content.matchAll(/href="([^"]+)"/g)].find(
          ([, href]) => decode(href) === `${prefix}/catalogo?pagina=3`,
        );
        assert.ok(match);
        const response = await fetch(new URL(decode(match[1]), base!).href);
        assert.equal(response.status, 200);
        const last = await read("/catalogo?pagina=5");
        assert.doesNotMatch(last.content, /href="[^"]*pagina=6/);
      },
    );
    await t.test(
      "tutte le categorie, i brand e le 60 schede restituiscono link validi",
      async () => {
        for (const category of categoryDirectory) {
          const { response, content } = await read(
            `/categorie/${category.slug}`,
          );
          assert.equal(response.status, 200);
          assert.match(content, /href="[^"]*\/prodotti\//);
        }
        const directory = await read("/brand");
        for (const brand of brandDirectory) {
          assert.ok(
            directory.content.includes(`href="${prefix}/brand/${brand.slug}"`),
          );
          assert.equal(
            (await read(`/brand/${brand.slug}`)).response.status,
            200,
          );
        }
        const filtered = await read("/brand?q=Hetronic");
        assert.ok(filtered.content.includes(`href="${prefix}/brand/hetronic"`));
        const directoryCards =
          filtered.content.match(
            /<a\b[^>]*class="category-card directory-card brand-card"[^>]*>/g,
          ) || [];
        assert.equal(directoryCards.length, 1);
        assert.ok(directoryCards[0].includes(`/brand/hetronic`));
        for (const product of catalogProvider.list()) {
          const { response, content } = await read(`/prodotti/${product.slug}`);
          assert.equal(response.status, 200, product.slug);
          assert.ok(content.includes(product.code));
          for (const match of content.matchAll(
            /href="[^"]*\/prodotti\/([^"?]+)"/g,
          ))
            assert.ok(catalogProvider.find(match[1]), match[1]);
        }
      },
    );
    await t.test(
      "pagine malformate, oltre il limite e slug inesistenti sono HTTP 404",
      async () => {
        for (const path of [
          "/catalogo?pagina=0",
          "/catalogo?pagina=-1",
          "/catalogo?pagina=2.5",
          "/catalogo?pagina=NaN",
          "/catalogo?pagina=",
          "/catalogo?pagina=999",
          "/catalogo?pagina=1&pagina=2",
          "/catalogo?q=nessunprodotto&pagina=2",
          "/categorie/funi?pagina=2",
          "/brand/hbc?pagina=2",
          "/prodotti/non-esiste",
          "/categorie/non-esiste",
          "/brand/non-esiste",
        ]) {
          const result = await read(path);
          assert.equal(result.response.status, 404, path);
          assert.doesNotMatch(result.html, /rel="canonical"/);
        }
      },
    );
    await t.test(
      "canonical e BreadcrumbList solo con origine configurata, asset sotto il percorso",
      async () => {
        const { html } = await read("/catalogo?pagina=2");
        if (origin) {
          assert.ok(
            html.includes(`rel="canonical" href="${origin}/catalogo?pagina=2"`),
          );
          const data = await read("/categorie/funi");
          assert.match(data.html, /"@type":"BreadcrumbList"/);
          assert.ok(data.html.includes(`"item":"${origin}/categorie/funi"`));
        } else assert.doesNotMatch(html, /"@type":"BreadcrumbList"/);
        const home = await read("/");
        const assets = [...home.html.matchAll(/(?:src|href)="([^"]+)"/g)]
          .map(([, url]) => decode(url))
          .filter((url) => url.includes("/_next/") || url.includes("/images/"));
        for (const url of [...new Set(assets)]) {
          if (prefix) assert.ok(url.startsWith(`${prefix}/`), url);
          assert.equal(
            (await fetch(new URL(url, base!).href)).status,
            200,
            url,
          );
        }
      },
    );
  },
);
