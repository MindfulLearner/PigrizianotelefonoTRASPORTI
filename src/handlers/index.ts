import express, { Request, Response } from 'express';
import { handleGetBusTime } from './handlers/handlers';

const app = express();
const port = 3000;

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
