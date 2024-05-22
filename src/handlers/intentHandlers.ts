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
