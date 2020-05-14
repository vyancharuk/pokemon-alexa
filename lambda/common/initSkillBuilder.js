const { SkillBuilders } = require('ask-sdk-core');

const {
  LaunchRequestHandler,
  HelpIntentHandler,
  FallbackIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  IntentReflectorHandler,
  YesIntentHandler,
  NoIntentHandler,
  ErrorHandler,
} = require('../../intentHandlers/generalIntents');

const { PokemonInfoHandler } = require('../../intentHandlers/pokemonInfo');
const { PokemonTraitHandler } = require('../../intentHandlers/pokemonTrait');

const initSkillBuilder = () => {
  const skillBuilder = SkillBuilders.custom();

  skillBuilder.addRequestHandlers(
    LaunchRequestHandler,
    PokemonInfoHandler,
    PokemonTraitHandler,
    YesIntentHandler,
    NoIntentHandler,
    FallbackIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  );

  skillBuilder.addErrorHandlers(ErrorHandler);

  return skillBuilder;
};

module.exports = {
  initSkillBuilder,
};
