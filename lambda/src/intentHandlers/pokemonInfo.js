const { getRequestType, getIntentName, getSlot } = require('ask-sdk-core');
const _ = require('lodash');
const { PROMPT, POKEMON_SLOT } = require('../common/constants');
const utils = require('../common/utils');

const PokemonInfoHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      getIntentName(handlerInput.requestEnvelope) === 'pokemon_info'
    );
  },
  async handle(handlerInput) {
    try {
      const pokeNameSlot = getSlot(handlerInput.requestEnvelope, POKEMON_SLOT);
      const pokeName = utils.getSlotValue(pokeNameSlot);

      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();

      // Make sure there is a valid slot value.
      if (_.isNil(pokeNameSlot)) {
        sessionAttributes.unknownPokemon = true;

        const speakOutput = `hmm, I'm not sure I know about this pokemon, are you sure it is a pokemon?`;
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .reprompt(speakOutput)
          .getResponse();
      }

      // load from memory cache pokemon info if it is already requested
      const pokeInfo = await utils.getPokemonInfo(pokeName);

      let speakOutput = '';

      if (!pokeInfo) {
        sessionAttributes.unknownPokemon = pokeName;

        speakOutput = `hmm, I'm not sure I know about ${pokeName}, are you sure it is a pokemon?`;
      } else {
        const traits = Object.keys(pokeInfo)
          .filter((trait) => trait !== 'type')
          .map((trait) => `a ${trait} of ${pokeInfo[trait]}`);

        speakOutput = `${_.capitalize(pokeName)} is an ${
          pokeInfo.type
        } type pokemon with ${traits.join(' and ')}. ${PROMPT}`;
      }

      if (speakOutput) {
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .reprompt(speakOutput)
          .getResponse();
      }
    } catch (ex) {
      console.error('Exception', ex);

      const speakOutput = `Oops something went wrong. ${PROMPT}`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .reprompt(speakOutput)
        .getResponse();
    }
  },
};

module.exports = {
  PokemonInfoHandler,
};
