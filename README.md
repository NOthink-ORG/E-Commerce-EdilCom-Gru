# Edilcom Gru — frontend e-commerce

Frontend **Next.js App Router, React e TypeScript**, basato sui cinque mockup forniti. Nessun backend commerciale, ERP o pagamento è integrato.

## Avvio

Richiede Node.js 24 LTS (da 24.11, inferiore a 25). Le dipendenze sono fissate alle versioni esatte del lockfile.

```sh
npm ci
npm run dev
```

Aprire http://localhost:3000. Per una build di produzione:

```sh
npm run build
npm start
```

Controlli disponibili: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. La CI esegue anche `npm ci` su push e pull request. I test delle funzioni pure usano il runner integrato di Node.

## Pagine e funzionalità

| Pagina        | URL                                      | Comportamento                                                                                         |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Home          | `/`                                      | Hero, ricerca, sei categorie, prodotti in evidenza e assistenza                                       |
| Catalogo      | `/catalogo`                              | Ricerca nome/codice/marca, filtri combinabili, ordinamento, griglia/elenco, paginazione e stato vuoto |
| Prodotto      | `/prodotti/radiocomando-hetronic-nova-l` | Galleria, quantità, prezzi IVA inclusa/esclusa, descrizione, dati tecnici, assistenza e correlati     |
| Categorie     | `/categorie`, `/categorie/[slug]`        | Directory e catalogo nella categoria, con filtri condivisi                                            |
| Brand         | `/brand`, `/brand/[slug]`                | Ricerca marchi e catalogo nel brand, con filtri condivisi                                             |
| Assistenza    | `/assistenza`                            | Modulo validato e riepilogo copiabile locale, senza invio né salvataggio                              |
| Carrello      | `/carrello`                              | Modifica quantità, rimozione, svuotamento, calcoli IVA e spedizione, sconto `DEMO10`                  |
| Checkout demo | `/checkout`                              | Azienda/privato, fatturazione separata, scelta spedizione e verifica campi; nessun ordine o pagamento |

Il carrello parte vuoto. Carrello e codice promozionale demo sono salvati nel `localStorage` di questo browser. Gli indirizzi, le note e i dati cliente non vengono trasmessi né salvati in uno storage persistente. L’assistenza prepara un testo copiabile: non invia messaggi.

## Struttura

- `app/`: route, metadati, loading/error/not-found e layout condiviso.
- `app/globals.css`: importa i file CSS in `app/styles/`, separati per responsabilità. Token condivisi in `foundation.css`.
- `components/home-sections.tsx`: `Hero`, `CategoryShowcase`, `FeaturedProducts`, configurabili tramite props e riordinabili nella Home.
- `components/shell.tsx`: `Header`, `Footer`, `SupportBanner`, `Benefits`.
- `components/ui.tsx`: una sola implementazione di `ProductCard`, `ProductGrid`, `SearchBar`, `QuantitySelector`, `StockBadge`, `Price`, `Breadcrumbs` e intestazioni.
- `components/catalog-view.tsx`, `filter-drawer.tsx`: catalogo e filtri mobile in dialog nativo con focus confinato.
- `components/store-provider.tsx`: carrello, persistenza validata, feedback e dialog condivisi.
- `components/order-summary.tsx`: riepilogo usato sia nel carrello sia nel checkout.
- `lib/catalog.ts`, `demo-products.ts`, `product.ts`: fixture, tipi, categorie e brand.
- `lib/catalog-logic.ts`, `cart-logic.ts`, `order.ts`, `seo.ts`: funzioni pure condivise, verificate in `tests/`.
- `components/product-gallery.tsx`: miniature, navigazione, tastiera e ingrandimento; esempio con tre foto in `/prodotti/fune-acciaio-16mm`.
- `components/support-form.tsx`: assistenza locale; query prodotto verificata contro le fixture.
- `AGENTS.md` e `docs/DEVELOPMENT_STANDARDS.md`: regole permanenti da leggere prima delle modifiche.
- `public/images/`: immagini locali; `public/fonts/`: Inter locale con licenza OFL.

## Dati demo e calcoli

I 60 prodotti, SKU, prezzi, disponibilità, associazioni di compatibilità e marchi riprendono esempi visivi dei mockup. **Non sono dati verificati.** Nessuna partnership o specifica tecnica è certificata dal frontend.

I prezzi sono IVA esclusa. Nell’esempio: IVA 22%, trasporto € 12,00 imponibili, spedizione gratuita da € 300 di prodotti dopo lo sconto; ritiro gratuito. `DEMO10` applica il 10% solo ai prodotti. Gli importi vengono arrotondati ai centesimi; carrello e checkout usano lo stesso calcolo. Le quantità sono intere da 1 a 999, anche per gli articoli venduti al metro.

I filtri sono rappresentati nell’URL e combinati in AND tra gruppi, OR all’interno dello stesso gruppo. La ricerca normalizza accenti, maiuscole e spazi e privilegia SKU esatto, prefisso SKU, nome esatto, termini nel nome, quindi corrispondenze parziali. Reset e filtri preservano il contesto delle pagine categoria e brand. Disponibili include anche pochi pezzi; i prodotti esauriti non sono aggiungibili al carrello. Le associazioni di compatibilità sono dichiaratamente dimostrative. `catalogProvider` e le fixture sono il punto da sostituire con il catalogo reale.

## Asset da sostituire e integrazioni

- Logo e foto prodotto sono illustrativi: comprendono ritagli dai mockup e foto demo online. Fonti e limiti di licenza in `public/images/demo/sources.json`; le foto commerciali demo richiedono sostituzione o autorizzazione prima della pubblicazione. Le due foto aggiuntive della galleria campione sono Wikimedia Commons con attribuzione e licenze CC BY 2.5 / CC BY-SA 2.5 registrate nel manifest e mostrate in pagina.
- Il banner assistenza e la fascia marchi derivano dai mockup. La fascia è descritta come marchi del catalogo demo, senza affermare partnership.
- L’immagine hero è una fotografia illustrativa generata per questo progetto. Il resto dell’interfaccia è HTML, CSS e componenti React interattivi.
- `scripts/prepare-assets.mjs` documenta la provenienza dei ritagli. Per rigenerarli occorrono i file sorgenti nella cartella Downloads indicata nello script; per avviare il progetto bastano gli asset già inclusi.
- Contatti e dati societari attendono conferma; le voci informative aprono un dialog che indica i contenuti mancanti.
- Da integrare: catalogo/prezzi/stock reali, regole fiscali e spedizioni ufficiali, checkout, ordini, assistenza, documenti legali e autenticazione.
- Il sito demo è configurato `noindex, nofollow`. L’indicizzazione va abilitata solo con contenuti e dati ufficiali.

## Riferimento visivo

Sono mantenuti bianco/grigio/antracite e giallo, header condiviso, hero industriale, ricerca sovrapposta, card con immagine/codice/marca/prezzo, banner tecnico, vantaggi e footer. Le variazioni intenzionali riguardano i contenuti non verificati, l’hero illustrativo, il catalogo iniziale completo, l’adattamento mobile e il checkout esplicitamente non operativo.
