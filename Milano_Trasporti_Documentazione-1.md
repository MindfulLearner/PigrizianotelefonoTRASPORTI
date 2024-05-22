
# Documentazione del Progetto "Milano Trasporti"

## Obiettivo del Progetto
L'obiettivo di questo progetto è creare una skill per Alexa chiamata "Milano Trasporti" che fornisce informazioni sugli orari degli autobus a Milano. La skill deve essere in grado di rispondere alle richieste degli utenti riguardanti gli orari degli autobus specifici.

## Struttura del Progetto
Il progetto è organizzato come segue:

```
.
├── src
│   ├── handlers
│   │   └── intentHandlers.ts
│   └── index.ts
├── dist
│   └── (file compilati da TypeScript)
└── tsconfig.json
```

## File Principali

### index.ts
Questo è il file principale del server che gestisce le richieste HTTP e le rotte.

```typescript
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { handleGetBusTime } from './handlers/intentHandlers';
import ngrok = require('@ngrok/ngrok');
import dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/alexa', (req: Request, res: Response) => {
  console.log('Received request:', JSON.stringify(req.body, null, 2)); // Log the request

  // Aggiungi controllo e log per verificare cosa c'è nel corpo della richiesta
  if (!req.body || !req.body.request || !req.body.request.intent) {
    console.error('Invalid request structure:', JSON.stringify(req.body, null, 2));
    return res.status(400).json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Richiesta non valida',
        },
        shouldEndSession: true,
      },
    });
  }

  const intent = req.body.request.intent.name;

  if (intent === 'GetBusTime') {
    handleGetBusTime(req, res);
  } else {
    console.log('Intent not recognized:', intent); // Log unrecognized intents
    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Intento non riconosciuto',
        },
        shouldEndSession: true,
      },
    });
  }
});

// Aggiungi una route per il percorso radice
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const listener = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTHTOKEN
    });

    // Aggiungi debug per vedere cosa restituisce ngrok
    console.log('ngrok connection details:', listener);

    const url = listener.url();
    console.log(`Ingress established at: ${url}`);
  } catch (error) {
    console.error('Error connecting to ngrok:', error);
  }
});
```

### intentHandlers.ts
Questo file contiene la logica per gestire l'intento `GetBusTime`.

```typescript
import { Request, Response } from 'express';

export const handleGetBusTime = async (req: Request, res: Response) => {
  const slotValues = req.body.request.intent.slots;
  const busLine = slotValues.BusLine.value;
  const direction = slotValues.Direction.value;

  // Simula una risposta
  const nextBusTime = "5 minuti"; // Risposta simulata

  const speechText = `Il prossimo autobus della linea ${busLine} verso ${direction} arriva tra ${nextBusTime}`;

  const aplDocument = {
    type: "APL",
    version: "1.4",
    mainTemplate: {
      items: [
        {
          type: "Text",
          text: speechText,
          fontSize: "50dp"
        }
      ]
    }
  };

  res.json({
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: speechText,
      },
      directives: [
        {
          type: "Alexa.Presentation.APL.RenderDocument",
          token: "welcomeToken",
          document: aplDocument
        }
      ],
      shouldEndSession: true,
    },
  });
};
```

### tsconfig.json
File di configurazione di TypeScript.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

## Passaggi per Avviare il Progetto

1. **Installare le dipendenze**:

    ```sh
    npm install
    ```

2. **Compilare il codice TypeScript**:

    ```sh
    tsc
    ```

3. **Eseguire il server**:

    ```sh
    node dist/index.js
    ```

4. **Testare con `curl`**:

    ```sh
    curl -X POST https://<your-ngrok-url>/alexa -H "Content-Type: application/json" -d '{
      "request": {
        "type": "IntentRequest",
        "intent": {
          "name": "GetBusTime",
          "slots": {
            "BusLine": {
              "name": "BusLine",
              "value": "92"
            },
            "Direction": {
              "name": "Direction",
              "value": "Duomo"
            }
          }
        }
      }
    }'
    ```

## Stato Attuale del Progetto

- **Server**: Il server è configurato e risponde alle richieste HTTP.
- **Ngrok**: Configurato per esporre il server locale su internet.
- **Gestione Intenti**: L'intento `GetBusTime` è implementato e risponde con una risposta simulata.
- **Debug**: È stato aggiunto un controllo per la struttura delle richieste per evitare errori.

## Problemi e Considerazioni

1. **Struttura della Richiesta**: Verificare che le richieste inviate siano formattate correttamente e contengano tutti i campi necessari.
2. **Risposte Simulate**: Attualmente, la risposta dell'intento `GetBusTime` è simulata. Bisogna integrarla con un servizio reale per ottenere i dati degli orari degli autobus.
3. **Errore Ngrok**: Assicurarsi che ngrok sia correttamente configurato e attivo.
4. **Espansione degli Intenti**: Considerare l'aggiunta di altri intenti come `AMAZON.HelpIntent`, `AMAZON.StopIntent`, ecc.

## Domande per Prossimi Sviluppi

1. **Integrazione con API Realistiche**: Quali API possiamo usare per ottenere dati reali sugli orari degli autobus a Milano?
2. **Gestione di Altri Intenti**: Quali altri intenti dovrebbero essere supportati dalla skill?
3. **Miglioramenti alla Logica di Gestione**: Come possiamo migliorare la gestione degli intenti per supportare più casi d'uso?
4. **Debug e Logging**: Quali ulteriori informazioni di debug potrebbero essere utili per risolvere eventuali problemi?

Se avete domande o necessitate di ulteriori chiarimenti, non esitate a chiedere.
