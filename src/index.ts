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

// questa interfaccia descrive la struttura della risposta dell'api dei cani. perché? perché tutti amano i cani, ovviamente.
interface DogApiResponse {
    message: { [key: string]: string[] };
    status: string;
}

const app = express();
app.use(morgan("dev")); // logging di livello pro: ora puoi vedere tutto ciò che accade nel tuo server!

const PORT = process.env.PORT || 3000; // la tua porta preferita per far funzionare il server. 3000 è come una casa accogliente per i server.

const launchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        // se il tipo di richiesta è "launchrequest", possiamo gestirla. facile come accendere una luce!
        return request.type === "LaunchRequest";
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "ethan, ciao! come posso aiutarti oggi?";
        const repromptSpeech = "ti serve ancora sapere qualcosa?";
        // risposta con un saluto caloroso, perché chi non ama un po' di calore?
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptSpeech)
            .getResponse();
    },
};

const getBusTimeIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        console.log("intent received:", request.type, (request as any).intent.name);
        // quando qualcuno vuole sapere l'orario dell'autobus, siamo pronti a rispondere!
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
            
            let speechText = `l'autobus ${randomBreed} passa tra poco.`;
            const subBreeds = data.message[randomBreed];

            if (subBreeds && subBreeds.length > 0) {
                const randomSubBreed = subBreeds[Math.floor(Math.random() * subBreeds.length)];
                speechText = `l'autobus ${randomBreed} passa alle ${randomSubBreed}.`;
            }

            const repromptSpeech = "hai bisogno di altre informazioni sui trasporti?";

            // risposta divertente con l'orario dell'autobus e il nome di una razza di cane. sì, è strano, ma anche divertente!
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptSpeech)
                .getResponse();
        } catch (error) {
            console.error(error);
            const speechText = "non sono riuscito a recuperare le informazioni dell'autobus al momento.";
            // ops! qualcosa è andato storto. meglio avvisare l'utente con un messaggio chiaro.
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
        // chi vuole sapere lo stato della metro? siamo qui per rispondere!
        return (
            request.type === "IntentRequest" &&
            (request as any).intent.name === "getMetroStatus"
        );
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "la metro gialla è aperta";
        const repromptSpeech = "ti serve sapere altro sulla metro?";

        // una risposta semplice ma utile: la metro è aperta! che sollievo.
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptSpeech)
            .getResponse();
    },
};

const stopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        // l'utente vuole fermarsi? diamo un addio amichevole!
        return (
            request.type === "IntentRequest" &&
            (request as any).intent.name === "AMAZON.StopIntent"
        );
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = "a presto!";
        // non dimenticare di chiudere la sessione. fai ciao ciao all'utente.
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const sessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        // fine della sessione. tutto è andato bene!
        return request.type === "SessionEndedRequest";
    },
    handle(handlerInput: HandlerInput): Response {
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler: ErrorHandler = {
    canHandle(): boolean {
        // questo gestore d'errori è sempre pronto a intervenire. come un supereroe!
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error): Response {
        const speakOutput = "scusa, non ho capito bene cosa hai detto. riprova.";
        console.log(`~~~~ error handled: ${JSON.stringify(error)}`);
        // gli errori accadono. manteniamo la calma e informiamo l'utente con gentilezza.
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
