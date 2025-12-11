# Turni Pulizie - Web App (PWA)

Web app statica (HTML/CSS/JS) per gestire turni e scadenze di pulizia.
È pensata per essere pubblicata su GitHub Pages ed usata da telefono come PWA.

Questa versione include:
- assegnazione automatica dei lavori con bilanciamento “pesato” per intervallo;
- regole per persona (**preferenze** / **esclusioni**);
- lavori personalizzati;
- note per singolo lavoro;
- gestione scadenze con possibilità di **posticipare** di X giorni;
- storico completamenti + inserimento manuale;
- statistiche;
- tema chiaro/scuro;
- sincronizzazione su **Firebase Firestore** con fallback locale.

## Pagine

- **Home (`index.html`)**
  - riepilogo lavori in scadenza, completati oggi e totale completati;
  - pulsanti di navigazione.

- **Da Fare (`dafare.html`)**
  - mostra i lavori attualmente in scadenza o in ritardo, divisi per intervallo;
  - per ogni lavoro puoi:
    - vedere l’assegnatario;
    - scegliere chi lo ha effettivamente svolto;
    - segnare il lavoro come completato.
  - Le note salvate nelle Impostazioni compaiono anche qui.

- **Scadenze (`scadenze.html`)**
  - vista dei lavori con prossima scadenza calcolata;
  - opzione per posticipare una scadenza di un certo numero di giorni.

- **Completati (`completati.html`)**
  - storico dei lavori completati con filtri;
  - export CSV.

- **Statistiche (`statistiche.html`)**
  - conteggi per persona e intervallo, trend e riepiloghi.

- **Impostazioni (`impostazioni.html`)**
  - gestione dipendenti;
  - assegnazione automatica:
    - di **tutti** i lavori,
    - oppure solo di quelli attualmente in scadenza;
  - regole di assegnazione (exclude/prefer);
  - aggiunta/rimozione lavori personalizzati;
  - note per singolo lavoro;
  - tema e giorno standard mensile.

## Scadenze

La prossima scadenza viene calcolata in modo **calendario**:

- **Settimana**: +7 giorni
- **Mese**: +1 mese
- **Due mesi**: +2 mesi
- **Anno**: +1 anno

Se è impostato un **giorno standard mensile**, i lavori mensili/due-mesi
vengono ancorati a quel giorno (es. 15 del mese), quando possibile.

## Dati e sincronizzazione

Lo stato globale viene salvato in:
1) **Firestore** (se disponibile)
2) **localStorage** come fallback.

Per evitare che il documento Firestore cresca all’infinito,
la lista dei completati viene mantenuta automaticamente entro
un limite di **1000 voci** (le più recenti).

## Sicurezza Firestore

La configurazione client Firebase è pubblica per natura.
La sicurezza reale dipende dalle **Firestore Security Rules**.

Se usi un progetto Firebase tuo, si consiglia di:
- abilitare Firebase Auth per il responsabile;
- impostare regole che permettano lettura/scrittura solo ad utenti autenticati.

Nel progetto trovi un esempio di regole in `firestore.rules.example`.

## Avvio rapido

Apri `index.html` su un server statico o pubblica la cartella su GitHub Pages.
Per usare Firestore, configura il progetto in `firebase-config.js`.

## Licenza

Progetto interno / uso privato.
