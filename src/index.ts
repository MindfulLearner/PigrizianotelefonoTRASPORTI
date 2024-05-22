import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from "ask-sdk-core";
import { Response, SessionEndedRequest } from "ask-sdk-model";
import express from "express";
import bodyParser from "body-parser";

const Alexa = require("ask-sdk-core");
const app = express();
app.use(bodyParser);
const PORT = process.env.PORT || 3000;

const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === "LaunchRequest";
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "Ciao! Chiedemi quello che vuoi!";
        const repromptSpeech = "Ti serve ancora sapere qualcosa?";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptSpeech)
            .withSimpleCard("Milano Mezzi", speechText)
            .getResponse();
    },
};

const HelloWorldIntentHandler: RequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                "HelloWorldIntent"
        );
    },
    handle(handlerInput) {
        const speakOutput = "Hello World!";

        return (
            handlerInput.responseBuilder
                .speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse()
        );
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

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, HelloWorldIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent("sample/hello-world/v1.2")
    .lambda();

const skillBuilder = SkillBuilders.custom().addRequestHandler(
    LaunchRequestHandler,
    HelloWorldIntentHandler
);

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
