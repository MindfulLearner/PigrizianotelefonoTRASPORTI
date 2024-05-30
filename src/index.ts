// Importa moduli necessari da "ask-sdk-core" e "ask-sdk-model"
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

// Crea un'app Express e configura il logger morgan per il logging delle richieste HTTP
const app = express();
app.use(morgan("dev"));

// Definisce la porta su cui il server ascolterà, preleva dal file di configurazione o usa la porta 3000 come default
const PORT = process.env.PORT || 3000;

// Definisce il gestore delle richieste di avvio (LaunchRequestHandler)
const LaunchRequestHandler: RequestHandler = {
    // Verifica se il gestore può gestire la richiesta (se è un "LaunchRequest")
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === "LaunchRequest";
    },
    // Gestisce la richiesta di avvio, risponde con un messaggio di benvenuto
    handle(handlerInput: HandlerInput): Response {
        const speechText = "ethan, ciao! Come posso aiutarti oggi?";
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

// Definisce il gestore per l'intento "GetBusTime"
const GetBusTimeIntentHandler: RequestHandler = {
    // Verifica se il gestore può gestire la richiesta (se è un "IntentRequest" con nome "GetBusTime")
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === "IntentRequest" &&
            request.intent.name === "GetBusTime"
        );
    },
    // Gestisce la richiesta, risponde con informazioni sul bus
    handle(handlerInput: HandlerInput): Response {
        const speechText =
            "L'autobus 92 passa tra 42 anni. La 92 è l'autobus nella quale troverai tutte le risposte.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard("The weather today is sunny.", speechText)
            .getResponse();
    },
};

// Definisce il gestore per l'intento "getMetroStatus"
const getMetroStatusIntentHandler: RequestHandler = {
    // Verifica se il gestore può gestire la richiesta (se è un "IntentRequest" con nome "getMetroStatus")
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === "IntentRequest" &&
            request.intent.name === "getMetroStatus"
        );
    },
    // Gestisce la richiesta, risponde con informazioni sullo stato della metro
    handle(handlerInput: HandlerInput): Response {
        const speechText = "La metro gialla è aperta";

        return handlerInput.responseBuilder.speak(speechText).getResponse();
    },
};

// Definisce un gestore per gli errori generici
const ErrorHandler: ErrorHandler = {
    // Specifica che questo gestore può gestire tutti gli errori
    canHandle() {
        return true;
    },
    // Gestisce l'errore, logga l'errore e risponde con un messaggio di scuse
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

// Configura il gestore principale per l'Alexa Skill con i gestori di richieste e l'ErrorHandler
exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetBusTimeIntentHandler,
        getMetroStatusIntentHandler
    )
    .addErrorHandlers(ErrorHandler);

// Crea l'oggetto skill e l'adapter per integrarlo con Express
const skillBuilder = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetBusTimeIntentHandler,
        getMetroStatusIntentHandler
    )
    .addErrorHandlers(ErrorHandler);

const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

// Definisce il punto di ingresso per le richieste POST al webhook di Alexa
app.post("/api/v1/webhook-alexa", adapter.getRequestHandlers());
app.post("/api/v1/webhook-alexa", (req, res) => {
    console.log(res);
    console.log(req);
});

// Configura Express per usare il middleware JSON
app.use(express.json());

// Avvia il server Express sulla porta definita
app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});
