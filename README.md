# Edilcom Gru — frontend e-commerce

Frontend **Next.js App Router, React e TypeScript**, basato sui cinque mockup forniti. Nessun backend commerciale, ERP o pagamento è integrato.

## Avvio

Richiede Node.js 20.9 o successivo.

```sh
npm ci
npm run dev
```

Aprire http://localhost:3000. Per una build di produzione:

```sh
npm run build
npm start
```

Controlli disponibili: `npm run lint`, `npm run typecheck`, `npm run build`.

## Pagine e funzionalità

| Pagina        | URL                                      | Comportamento                                                                                         |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Home          | `/`                                      | Hero, ricerca, sei categorie, prodotti in evidenza e assistenza                                       |
| Catalogo      | `/catalogo`                              | Ricerca nome/codice/marca, filtri combinabili, ordinamento, griglia/elenco, paginazione e stato vuoto |
| Prodotto      | `/prodotti/radiocomando-hetronic-nova-l` | Gallery, quantità, prezzi IVA inclusa/esclusa, schede informative, assistenza e correlati             |
| Carrello      | `/carrello`                              | Modifica quantità, rimozione, svuotamento, calcoli IVA e spedizione, sconto `DEMO10`                  |
| Checkout demo | `/checkout`                              | Azienda/privato, fatturazione separata, scelta spedizione e verifica campi; nessun ordine o pagamento |

Il carrello parte vuoto. Carrello e codice promozionale demo sono salvati nel `localStorage` di questo browser. Gli indirizzi, le note e i dati cliente non vengono trasmessi né salvati in uno storage persistente. L’assistenza prepara un testo copiabile: non invia messaggi.

## Struttura

- `app/`: route, metadati, loading/error/not-found e layout condiviso.
- `app/globals.css`: token e stili responsive. Colori, larghezza, bordi e font si modificano nelle variabili `:root`.
- `components/home-sections.tsx`: `Hero`, `CategoryShowcase`, `FeaturedProducts`, configurabili tramite props e riordinabili nella Home.
- `components/shell.tsx`: `Header`, `Footer`, `SupportBanner`, `Benefits`.
- `components/ui.tsx`: una sola implementazione di `ProductCard`, `ProductGrid`, `SearchBar`, `QuantitySelector`, `StockBadge`, `Price`, `Breadcrumbs` e intestazioni.
- `components/catalog-view.tsx`, `filter-drawer.tsx`: catalogo e filtri mobile in dialog nativo con focus confinato.
- `components/store-provider.tsx`: carrello, persistenza validata, feedback e dialog condivisi.
- `components/order-summary.tsx`: riepilogo usato sia nel carrello sia nel checkout.
- `lib/catalog.ts`: fixture tipizzate, categorie, configurazione brand, provider demo e calcoli commerciali centralizzati.
- `public/images/`: immagini WebP locali; `public/fonts/`: Inter locale con licenza OFL.

## Dati demo e calcoli

I 20 prodotti, SKU, prezzi, disponibilità, associazioni di compatibilità e marchi riprendono esempi visivi dei mockup. **Non sono dati verificati.** Nessuna partnership o specifica tecnica è certificata dal frontend.

I prezzi sono IVA esclusa. Nell’esempio: IVA 22%, trasporto € 12,00 imponibili, spedizione gratuita da € 300 di prodotti dopo lo sconto; ritiro gratuito. `DEMO10` applica il 10% solo ai prodotti. Gli importi vengono arrotondati ai centesimi; carrello e checkout usano lo stesso calcolo. Le quantità sono intere da 1 a 999, anche per gli articoli venduti al metro.

I filtri sono rappresentati nell’URL e combinati in AND tra gruppi, OR all’interno dello stesso gruppo. La ricerca considera nome, SKU, marca e categoria. Le associazioni di compatibilità sono dichiaratamente dimostrative. `catalogProvider` e le fixture sono il punto da sostituire con il catalogo reale.

## Asset da sostituire e integrazioni

- Il logo e le foto dei prodotti sono **ritagli dai mockup allegati**, utilizzati come asset illustrativi. Servono logo vettoriale ufficiale e foto originali ad alta risoluzione per la pubblicazione.
- Il banner assistenza e la fascia marchi derivano dai mockup. La fascia è descritta come marchi del catalogo demo, senza affermare partnership.
- L’immagine hero è una fotografia illustrativa generata per questo progetto. Il resto dell’interfaccia è HTML, CSS e componenti React interattivi.
- `scripts/prepare-assets.mjs` documenta la provenienza dei ritagli. Per rigenerarli occorrono i file sorgenti nella cartella Downloads indicata nello script; per avviare il progetto bastano gli asset già inclusi.
- Contatti e dati societari attendono conferma; le voci informative aprono un dialog che indica i contenuti mancanti.
- Da integrare: catalogo/prezzi/stock reali, regole fiscali e spedizioni ufficiali, checkout, ordini, assistenza, documenti legali e autenticazione.
- Il sito demo è configurato `noindex, nofollow`. L’indicizzazione va abilitata solo con contenuti e dati ufficiali.

## Riferimento visivo

Sono mantenuti bianco/grigio/antracite e giallo, header condiviso, hero industriale, ricerca sovrapposta, card con immagine/codice/marca/prezzo, banner tecnico, vantaggi e footer. Le variazioni intenzionali riguardano i contenuti non verificati, l’hero illustrativo, il catalogo iniziale completo, l’adattamento mobile e il checkout esplicitamente non operativo.
