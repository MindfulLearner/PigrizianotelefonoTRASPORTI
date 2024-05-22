import { Request, Response } from 'express';

export const handleGetBusTime = (req: Request, res: Response) => {
    const slotValues = req.body.request.intent.slots;
    console.log('Slot values:', slotValues); // Log slot values for debugging

    const busLine = slotValues.BusNovantaDue.value;
    const direction = slotValues.Direzione.value;

    // Simulate the response
    const nextBusTime = "5 minuti";  // Simulate the wait time

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

    console.log('Response speech text:', speechText); // Log response text for debugging

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
        sessionAttributes: {}
    });
};
