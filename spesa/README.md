# La Bottega del Caffè — Web App Lista Spesa

Piccola webapp in HTML/CSS/JavaScript che gestisce:
- **Area dipendenti** con checklist della spesa in ordine alfabetico
- **Area admin** per:
  - vedere le liste inviate (con data, ora e dipendente)
  - aggiungere / modificare / eliminare prodotti della checklist
  - aggiungere / eliminare dipendenti abilitati all'accesso

Tutti i dati sono salvati in **localStorage del browser**, quindi non è richiesto alcun backend.

## Avvio

1. Scompatta lo ZIP.
2. Apri il file `index.html` in un browser moderno (Chrome, Edge, Firefox, Safari).
   - Puoi anche servire la cartella con un piccolo server statico, ma non è obbligatorio.

## Accessi iniziali

Alla prima apertura l'app crea automaticamente:

- Utente **admin** (ruolo amministratore)
  - **username:** `admin`
  - **PIN:** `0000`
- Due utenti dipendenti di esempio:
  - `mario` / `1234`
  - `anna` / `5678`

Puoi modificare/eliminare/aggiungere dipendenti dall'**Area Admin → Dipendenti**.

## Funzionamento

### Login

- Seleziona un utente dal menu a tendina.
- Digita il PIN / password.
- In base al ruolo vieni portato in **Area Dipendenti** o **Area Admin**.

### Area Dipendenti

- Vedi la **checklist della spesa** in ordine alfabetico.
- Per ogni voce puoi:
  - spuntare il prodotto
  - e/o indicare una quantità
- Premi **“Invia lista al responsabile”** per salvare e inviare la lista.
- La lista comparirà nell'area admin con data, ora e nome del dipendente.

### Area Admin

Tre tab principali:

1. **Liste inviate**
   - Visualizza tutte le liste con:
     - dipendente
     - data e ora di invio
     - prodotti richiesti con quantità
2. **Prodotti**
   - Aggiungi nuovi prodotti alla checklist
   - Modifica il nome dei prodotti esistenti
   - Elimina prodotti
3. **Dipendenti**
   - Aggiungi nuovi dipendenti (nome, username, PIN)
   - Elimina dipendenti esistenti (l'admin non può essere eliminato)

---

Il design utilizza i colori e lo stile del logo “La Bottega del Caffè” ed è completamente responsive.
