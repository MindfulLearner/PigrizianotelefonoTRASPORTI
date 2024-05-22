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
