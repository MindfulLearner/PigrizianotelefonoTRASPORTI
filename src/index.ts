import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from "ask-sdk-core";
import { Response, SessionEndedRequest } from "ask-sdk-model";
import express from "express";
import { ExpressAdapter } from "ask-sdk-express-adapter";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === "LaunchRequest";
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "Tua mamma troia";
        // const repromptSpeech = "Ti serve ancora sapere qualcosa?";

        return (
            handlerInput.responseBuilder
                .speak(speechText)
                // .reprompt(repromptSpeech)
                // .withSimpleCard("Milano Mezzi", speechText)
                .getResponse()
        );
    },
};

const GetBusTimeIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === "IntentRequest" &&
            request.intent.name === "GetBusTime"
        );
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText =
            "L'autobus 92 passa tra 42 anni. La 92 è l'autobus nella quale troverai tutte le risposte.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard("The weather today is sunny.", speechText)
            .getResponse();
    },
};
const getMetroStatusIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === "IntentRequest" &&
            request.intent.name === "getMetroStatus"
        );
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "La metro gialla è aperta";

        return handlerInput.responseBuilder.speak(speechText).getResponse();
    },
};
const ErrorHandler: ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput =
            "Sorry, I had trouble doing what you asked. Please try again.";
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

// exports.handler = Alexa.SkillBuilders.custom()
//     .addRequestHandlers(LaunchRequestHandler, GetBusTimeIntentHandler)
//     .addErrorHandlers(ErrorHandler);

exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetBusTimeIntentHandler,
        getMetroStatusIntentHandler
    )
    .addErrorHandlers(ErrorHandler);

const skillBuilder = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetBusTimeIntentHandler,
        getMetroStatusIntentHandler
    )
    .addErrorHandlers(ErrorHandler);

const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);
app.post("/api/v1/webhook-alexa", adapter.getRequestHandlers());
app.post("/api/v1/webhook-alexa", (req, res) => {
    console.log(res);
    console.log(req);
});
app.use(express.json());

app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});

// import express from 'express';
// import bodyParser from 'body-parser';
// import { handleGetBusTime } from './handlers/intentHandlers';

// const app = express();
// app.use(bodyParser.json());

// app.post('/alexa', (req, res) => {
//   const intent = req.body.request.intent.name;

//   if (intent === 'GetBusTime') {
//     handleGetBusTime(req, res);
//   } else {
//     res.json({
//       version: '1.0',
//       response: {
//         outputSpeech: {
//           type: 'PlainText',
//           text: 'Intendo non riconosciuto',
//         },
//         shouldEndSession: true,
//       },
//     });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
