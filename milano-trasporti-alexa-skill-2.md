
# Milano Trasporti Alexa Skill

## Descrizione

Questa skill di Alexa permette agli utenti di ottenere informazioni sugli orari dei bus a Milano. Quando l'utente chiede l'orario di una specifica linea di bus in una certa direzione, la skill risponde con l'orario previsto.

## Configurazione del Modello di Interazione

Assicurati che il modello di interazione nella Console Developer di Alexa includa l'intent `GetBusTime`. Ecco un esempio del modello di interazione:

```json
{
  "interactionModel": {
    "languageModel": {
      "invocationName": "milano trasporti",
      "intents": [
        {
          "name": "GetBusTime",
          "slots": [
            {
              "name": "BusLine",
              "type": "AMAZON.NUMBER"
            },
            {
              "name": "Direction",
              "type": "AMAZON.City"
            }
          ],
          "samples": [
            "quando arriva il {BusLine} per {Direction}",
            "a che ora passa il {BusLine} per {Direction}"
          ]
        },
        {
          "name": "AMAZON.HelpIntent",
          "samples": []
        },
        {
          "name": "AMAZON.CancelIntent",
          "samples": []
        },
        {
          "name": "AMAZON.StopIntent",
          "samples": []
        }
      ]
    }
  }
}
```

## Codice Server

### Dipendenze

Assicurati di installare le seguenti dipendenze nel tuo progetto:

```bash
npm install express body-parser @ngrok/ngrok dotenv
```

### Codice Principale

Ecco il codice principale del server che gestisce le richieste Alexa:

```javascript
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const intentHandlers_1 = require("./handlers/intentHandlers");
const ngrok = require("@ngrok/ngrok");
const dotenv = require("dotenv");
dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post('/alexa', (req, res) => {
    var _a, _b, _c;
    console.log('Received request:', JSON.stringify(req.body, null, 2)); // Log the request
    const intent = (_c = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.request) === null || _b === void 0 ? void 0 : _b.intent) === null || _c === void 0 ? void 0 : _c.name; // Use optional chaining to avoid errors if request or intent is undefined
    if (intent === 'GetBusTime') {
        (0, intentHandlers_1.handleGetBusTime)(req, res);
    } else {
        console.log('Intent not recognized:', intent); // Log unrecognized intents
        res.json({
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: 'ethan merda',
                },
                shouldEndSession: true,
            },
        });
    }
});
// Aggiungi una route per il percorso radice
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on port ${PORT}`);
    try {
        const listener = yield ngrok.connect({
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
}));
```

### Handler per l'Intent `GetBusTime`

Definisci la logica per gestire l'intent `GetBusTime` nel file `handlers/intentHandlers.js` (o .ts se usi TypeScript):

```javascript
// handlers/intentHandlers.js

function handleGetBusTime(req, res) {
    const busLine = req.body.request.intent.slots.BusLine.value;
    const direction = req.body.request.intent.slots.Direction.value;

    // Logica per ottenere l'orario del bus basata su busLine e direction
    // Qui devi implementare la logica per ottenere i dati reali sugli orari dei bus

    const responseText = `L'orario del bus ${busLine} per ${direction} è alle 14:30.`; // Esempio di risposta

    res.json({
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: responseText,
            },
            shouldEndSession: true,
        },
    });
}

module.exports = {
    handleGetBusTime,
};
```

## Domande e Progressi Finora

### Domande

1. **Come configurare il modello di interazione su Alexa?**
   - Assicurati di includere l'intent `GetBusTime` con i relativi slot `BusLine` e `Direction`.

2. **Come gestire le richieste non riconosciute?**
   - Il codice gestisce gli intenti non riconosciuti rispondendo con "ethan merda".

3. **Come configurare ngrok per il tunneling?**
   - Usa `ngrok` per esporre il server locale e ottenere un URL pubblico.

### Progressi Finora

- Abbiamo configurato il modello di interazione su Alexa.
- Abbiamo implementato un server Express che gestisce le richieste da Alexa.
- Abbiamo definito un handler per l'intent `GetBusTime`.
- Abbiamo configurato `ngrok` per esporre il server locale.
- Abbiamo gestito le richieste non riconosciute con un messaggio di debug.
