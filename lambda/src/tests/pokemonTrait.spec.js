/*global describe, before, after*/

const { AlexaTest, IntentRequestBuilder } = require('ask-sdk-test');
const sinon = require('sinon');
const utils = require('../common/utils');

const { handler } = require('../../index');
const { POKE_MAP } = require('../common/constants');

// initialize the testing framework
const skillSettings = {
  appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  userId: 'amzn1.ask.account.VOID',
  deviceId: 'amzn1.ask.device.VOID',
  locale: 'en-US',
};

const alexaTest = new AlexaTest(handler, skillSettings);

describe('Handle properly pokemon_trait intent', function () {
  before(() => {
    sinon.stub(utils, 'getPokemonInfo').callsFake((pokeName) => {
      return POKE_MAP[pokeName];
    });
  });

  after(() => {
    utils.getPokemonInfo.restore(); // Unwraps the spy
  });

  describe('Handle pokemon_trait for height trait for existing pikachu', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_trait')
          .withSlotResolution('pokemon', 'pikachu', 'pokemon', '')
          .withSlotResolution('trait', 'height', 'trait', '')
          .build(),
        saysLike: 'Pikachu is 4 high',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Handle pokemon_trait for unknown pokemon', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_trait')
          .withSlotResolution('pokemon', 'pika', 'pokemon', '')
          .withSlotResolution('trait', 'height', 'trait', '')
          .build(),
        saysLike:
          "hmm, I'm not sure I know about pika, are you sure it is a pokemon?",
        repromptsNothing: false,
        shouldEndSession: false,
        hasAttributes: {
          unknownPokemon: 'pika',
        },
      },
    ]);
  });

  describe('Handle pokemon_trait for unknown trait', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_trait')
          .withSlotResolution('pokemon', 'pikachu', 'pokemon', '')
          .withSlotResolution('trait', 'high', 'trait', '')
          .build(),
        saysLike:
          "hmm, I don't know if I know this high about pikachu, are you sure it is correct trait?",
        repromptsNothing: false,
        shouldEndSession: false,
        hasAttributes: {
          unknownTrait: 'high',
        },
      },
    ]);
  });

  describe('Handle pokemon_trait for incorrect pokemon slot', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_trait')
          .withSlotResolution('pokemon_wrong', 'pikachu', 'pokemon', '')
          .withSlotResolution('trait', 'high', 'trait', '')
          .build(),
        saysLike:
          "hmm, I'm not sure I know about this pokemon, are you sure it is a pokemon?",
        repromptsNothing: false,
        shouldEndSession: false,
        hasAttributes: {
          unknownPokemon: true,
        },
      },
    ]);
  });

  describe('Handle pokemon_trait for incorrect trait slot', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_trait')
          .withSlotResolution('pokemon', 'pikachu', 'pokemon', '')
          .withSlotResolution('trait_wrong', 'high', 'trait', '')
          .build(),
        saysLike:
          "hmm, I'm not sure I know about this trait, are you sure it is correct trait for pikachu?",
        repromptsNothing: false,
        shouldEndSession: false,
        hasAttributes: {
          unknownTrait: true,
        },
      },
    ]);
  });
});
