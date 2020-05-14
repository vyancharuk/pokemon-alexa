const {
  //   getSlotValue,
  getRequestType,
  getIntentName,
  getSlot,
} = require('ask-sdk-core');

const _ = require('lodash');
const { PROMPT, POKEMON_SLOT, TRAIT_SLOT } = require('../common/constants');
const utils = require('../common/utils');

const PokemonTraitHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      getIntentName(handlerInput.requestEnvelope) === 'pokemon_trait'
    );
  },
  async handle(handlerInput) {
    try {
      const pokeNameSlot = getSlot(handlerInput.requestEnvelope, POKEMON_SLOT);
      const pokeTraitSlot = getSlot(handlerInput.requestEnvelope, TRAIT_SLOT);

      const pokeName = utils.getSlotValue(pokeNameSlot);
      const pokeTrait = utils.getSlotValue(pokeTraitSlot);

      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();

      let speakOutput = '';
      // Make sure there is a valid slot value.
      if (_.isNil(pokeName)) {
        sessionAttributes.unknownPokemon = true;

        speakOutput = `hmm, I'm not sure I know about this pokemon, are you sure it is a pokemon?`;
      } else if (_.isNil(pokeTrait)) {
        // TODO: handle properly trait
        sessionAttributes.unknownTrait = true;

        speakOutput = `hmm, I'm not sure I know about this trait, are you sure it is correct trait for ${pokeName}?`;
      }

      if (speakOutput) {
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .reprompt(speakOutput)
          .getResponse();
      }

      // load from memory cache pokemon info if it is already requested
      const pokeInfo = await utils.getPokemonInfo(pokeName);

      if (!pokeInfo) {
        sessionAttributes.unknownPokemon = pokeName;

        speakOutput = `hmm, I'm not sure I know about ${pokeName}, are you sure it is a pokemon?`;
      } else if (!pokeInfo[pokeTrait]) {
        sessionAttributes.unknownTrait = pokeTrait;

        // speakOutput = `hmm, I'm not sure I know about about ${pokeTrait} trait for ${pokeName}, are you sure it is correct trait?`;
        // speakOutput = `hmm, I don't know if I know this ${pokeTrait} about ${pokeName}. Are you sure it is correct trait?`;
        speakOutput = `hmm, I don't know if I know this ${pokeTrait} about ${pokeName}, are you sure it is correct trait?`;
      } else {
        speakOutput = `${_.capitalize(pokeName)} is ${
          pokeInfo[pokeTrait]
        } ${utils.getTraitForm(pokeTrait)}. ${PROMPT}`;
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
  PokemonTraitHandler,
};
