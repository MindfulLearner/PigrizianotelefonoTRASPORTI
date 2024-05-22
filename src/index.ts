import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { handleGetBusTime } from './handlers/intentHandlers';
import ngrok from '@ngrok/ngrok';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Test route for GET /
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running and ready to accept requests!');
});

app.post('/alexa', (req: Request, res: Response) => {
  console.log('Received request:', JSON.stringify(req.body, null, 2)); // Log the request

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const listener = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTHTOKEN
    });

    console.log('ngrok connection details:', listener);

    const url = listener.url();
    console.log(`Ingress established at: ${url}`);
  } catch (error) {
    console.error('Error connecting to ngrok:', error);
  }
});
