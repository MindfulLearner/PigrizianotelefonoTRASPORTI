# ATM Milano Alexa Skill Michael Jackson

## Descrizione
Questa skill per Amazon Alexa permette agli utenti di Milano di ottenere informazioni sui trasporti pubblici forniti da ATM "Azienda Trasporti Milanesi". Gli utenti possono chiedere informazioni su orari, fermate, percorsi e altre utili informazioni relative ai trasporti pubblici.

## Funzionalità
- Ottenere orari e tempi di attesa per le fermate degli autobus e tram
- Ricevere aggiornamenti sullo stato del servizio delle linee metropolitane
- Pianificare il percorso più veloce utilizzando i mezzi pubblici
- Salvare le fermate e linee preferite per un accesso rapido

## Requisiti
- Account Amazon Developer
- Amazon Alexa Device
- Chiave API di Google Maps per funzionalità estese

## Installazione
1. **Configurazione della Skill Alexa**
   - Registrarsi come sviluppatore su [Amazon Developer Console](https://developer.amazon.com).
   - Creare una nuova skill Alexa e configurare l'endpoint.

2. **Configurazione del Server**
   - Clonare questo repository.
   - Installare le dipendenze richieste:
     ```bash
     npm install
     ```
   - Configurare le credenziali API (se si utilizza Google Maps):
     - Modifica il file `src/services/googleMapsService.ts` e sostituisci `YOUR_GOOGLE_MAPS_API_KEY` con la tua chiave API di Google Maps.

3. **Esecuzione del Server**
   - Compila il progetto TypeScript:
     ```bash
     npx tsc
     ```
   - Avvia il server di sviluppo:
     ```bash
     npx ts-node src/index.ts
     ```

## Utilizzo
- **Chiedere gli orari delle fermate**
  ```plaintext
  Alexa, chiedi ad ATM Milano l'orario del prossimo autobus alla fermata [nome fermata].
