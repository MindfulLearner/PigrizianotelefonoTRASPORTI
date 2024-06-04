import { RequestHandler, HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

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

export default getMetroStatusIntentHandler