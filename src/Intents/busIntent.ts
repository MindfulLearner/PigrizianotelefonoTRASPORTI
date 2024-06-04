import { RequestHandler, HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import axios from "axios";

interface DogApiResponse {
    message: { [key: string]: string[] };
    status: string;
}


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

export default getBusTimeIntentHandler