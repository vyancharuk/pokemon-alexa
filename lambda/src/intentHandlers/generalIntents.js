const { getRequestType, getIntentName } = require('ask-sdk-core');
const model = require('../../skill.json');
const { LAUNCH_MSG } = require('../common/constants');
const { cleanupSessionAttrs } = require('../common/utils');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    try {
      return handlerInput.responseBuilder
        .speak(LAUNCH_MSG)
        .reprompt(LAUNCH_MSG)
        .getResponse();
    } catch (ex) {
      console.error('Exception', ex);
    }
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    sessionAttributes.afterHelp = true;

    const examples =
      model.manifest.publishingInformation.locales['en-US'].examplePhrases;
    const speakOutput = `You asked for help. Here something you can ask me, ${examples
      .slice(1)
      .join(' or ')}. Would you like to continue, yes or no?`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const YesIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.YesIntent'
    );
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    let speechOutput;

    if (sessionAttributes.unknownPokemon) {
      speechOutput = `Sorry we don't know anything about ${
        sessionAttributes.unknownPokemon === true
          ? 'this'
          : sessionAttributes.unknownPokemon
      } pokemon. Say Help for some options.`;
    } else if (sessionAttributes.unknownTrait) {
      speechOutput = `Sorry we don't know anything about ${
        sessionAttributes.unknownTrait === true
          ? 'this'
          : sessionAttributes.unknownTrait
      } trait. Say Help for some options.`;
    } else if (sessionAttributes.afterHelp) {
      speechOutput =
        'Good. What else would you like to know about any Pokemon?';
    } else {
      speechOutput = `Hmm, I didn\'t know answer. Say help for some options.`;
    }

    cleanupSessionAttrs(sessionAttributes);

    return responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const NoIntentHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'
    );
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const sessionAttributes = attributesManager.getSessionAttributes();
    let speakOutput = 'Okay, talk to you later!';

    if (sessionAttributes.unknownPokemon || sessionAttributes.unknownTrait) {
      speakOutput = `Hmm, I didn\'t know answer. Say help for some options.`;
      cleanupSessionAttrs(sessionAttributes);
      return responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
    } else if (sessionAttributes.afterHelp) {
      // exit
      return responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .withShouldEndSession(true)
        .getResponse();
    }
    cleanupSessionAttrs(sessionAttributes);
    return responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
        getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Sorry, I don't know about that. Say help for some options?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

module.exports = {
  LaunchRequestHandler,
  YesIntentHandler,
  NoIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  FallbackIntentHandler,
  IntentReflectorHandler,
  ErrorHandler,
};
