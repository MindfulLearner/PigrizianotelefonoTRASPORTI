import express from 'express';
import bodyParser from 'body-parser';
import { handleGetBusTime } from './handlers/intentHandlers';

const app = express();
app.use(bodyParser.json());

app.post('/alexa', (req, res) => {
  const intent = req.body.request.intent.name;

  if (intent === 'GetBusTime') {
    handleGetBusTime(req, res);
  } else {
    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Intendo non riconosciuto',
        },
        shouldEndSession: true,
      },
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
