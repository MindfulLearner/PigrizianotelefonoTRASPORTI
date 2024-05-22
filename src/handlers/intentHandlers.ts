import { Request, Response } from 'express';
import { getBusTime } from '../services/googleMapsService';

export const handleGetBusTime = async (req: Request, res: Response) => {
  const slotValues = req.body.request.intent.slots;
  const busLine = slotValues.BusLine.value;
  const direction = slotValues.Direction.value;
  const userLocation = '45.4642035,9.189982'; // Esempio di posizione fissa, puoi sostituirlo con la posizione reale

  try {
    const data = await getBusTime(userLocation, direction);
    const nextBusTime = data.routes[0].legs[0].departure_time.text;

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
  } catch (error) {
    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Non riesco a ottenere le informazioni sui trasporti in questo momento. Riprova più tardi.',
        },
        shouldEndSession: true,
      },
    });
  }
};
