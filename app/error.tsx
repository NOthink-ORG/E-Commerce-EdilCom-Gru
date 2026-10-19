"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="contenuto" className="container empty-state">
      <h1>Qualcosa non ha funzionato.</h1>
      <p>Riprova a caricare questa pagina.</p>
      <button className="button primary" onClick={reset}>
        Riprova
      </button>
    </main>
  );
}
