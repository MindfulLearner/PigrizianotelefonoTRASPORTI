import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import express from "express";
import { ExpressAdapter } from "ask-sdk-express-adapter";
import morgan from "morgan";
import axios from 'axios';

interface DogApiResponse {
    message: { [key: string]: string[] };
    status: string;
}

const app = express();
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

const launchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === "LaunchRequest";
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "ethan, ciao! Come posso aiutarti oggi?";
        const repromptSpeech = "Ti serve ancora sapere qualcosa?";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptSpeech)
            .getResponse();
    },
};

const getBusTimeIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        console.log("Intent received:", request.type, (request as any).intent.name);
        return (
            request.type === "IntentRequest" &&
            (request as any).intent.name === "getBusTime"
        );
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        try {
            const response = await axios.get('https://dog.ceo/api/breeds/list/all');
            const data: DogApiResponse = response.data;
            const breeds = Object.keys(data.message);
            const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
            
            let speechText = `L'autobus ${randomBreed} passa tra poco.`;
            const subBreeds = data.message[randomBreed];

            if (subBreeds && subBreeds.length > 0) {
                const randomSubBreed = subBreeds[Math.floor(Math.random() * subBreeds.length)];
                speechText = `L'autobus ${randomBreed} passa alle ${randomSubBreed}.`;
            }

            const repromptSpeech = "Hai bisogno di altre informazioni sui trasporti?";

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptSpeech)
                .getResponse();
        } catch (error) {
            console.error(error);
            const speechText = "Non sono riuscito a recuperare le informazioni dell'autobus al momento.";
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    },
};

const getMetroStatusIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === "IntentRequest" &&
            (request as any).intent.name === "getMetroStatus"
        );
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "La metro gialla è aperta";
        const repromptSpeech = "Ti serve sapere altro sulla metro?";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptSpeech)
            .getResponse();
    },
};

const stopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === "IntentRequest" &&
            (request as any).intent.name === "AMAZON.StopIntent"
        );
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "A presto!";
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const sessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === "SessionEndedRequest";
    },
    handle(handlerInput: HandlerInput): Response {
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler: ErrorHandler = {
    canHandle(): boolean {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error): Response {
        const speakOutput = "Scusa, non ho capito bene cosa hai detto. Riprova.";
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const skillBuilder = SkillBuilders.custom()
    .addRequestHandlers(
        launchRequestHandler,
        getBusTimeIntentHandler,
        getMetroStatusIntentHandler,
        stopIntentHandler,
        sessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler);

const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.post("/api/v1/webhook-alexa", adapter.getRequestHandlers());

app.use(express.json());

app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});
