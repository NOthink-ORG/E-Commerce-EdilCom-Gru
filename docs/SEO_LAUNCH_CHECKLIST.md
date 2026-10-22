# SEO — prima del lancio

- Confermare origine e percorso: `NEXT_PUBLIC_SITE_URL` (origine HTTP(S), anche con percorso) e `NEXT_PUBLIC_BASE_PATH` (vuoto oppure lo stesso percorso). Ricostruire la build dopo ogni modifica. In produzione senza origine confermata canonical assolute e BreadcrumbList sono intenzionalmente omessi; localhost non è consentito.
- Importare il catalogo reale tramite `catalogProvider` e i dati Mago4; verificare SKU, OEM/MPN, eventuali GTIN, compatibilità, testi, immagini e licenze.
- Configurare title/description reali, inclusi eventuali override `Product.seo` e alt descrittivi.
- Implementare `Product`/`Offer` solo dopo conferma dei dati commerciali e dello stock.
- Preparare sitemap XML reale, robots.txt che consenta di leggere le direttive delle pagine, Merchant Center se applicabile e Search Console.
- Confermare pagine pubbliche e varianti da indicizzare; mantenere carrello, checkout e ricerca interna esclusi.
- Verificare redirect, canonical, breadcrumb, link e stati HTTP 404/200 su dominio e percorso definitivi, inclusa paginazione filtrata/ordinata.
- Eseguire Lighthouse e misurare Core Web Vitals in condizioni reali.
- Solo dopo autorizzazione e sostituzione delle fixture rimuovere il blocco `publication.demo` in `lib/site-config.ts`. Il codice richiederà inoltre `SEO_PUBLICATION_MODE=published`, `SEO_INDEXING_AUTHORIZED=true`, ambiente `production` (`VERCEL_ENV` oppure `DEPLOYMENT_ENV`) e origine HTTPS. Le sole variabili non abilitano l’indicizzazione della demo attuale.
