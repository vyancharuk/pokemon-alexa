/*global describe, before, after*/

const sinon = require('sinon');
const utils = require('../common/utils');

const { AlexaTest, IntentRequestBuilder } = require('ask-sdk-test');

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

describe('Handle properly pokemon_info intent', function () {
  before(() => {
    sinon.stub(utils, 'getPokemonInfo').callsFake((pokeName) => {
      return POKE_MAP[pokeName];
    });
  });

  after(() => {
    utils.getPokemonInfo.restore(); // Unwraps the spy
  });

  describe('Handle pokemon_info for existing pikachu', () => {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_info')
          .withSlotResolution('pokemon', 'pikachu', 'pokemon', '')
          .build(),
        saysLike:
          'Pikachu is an electric type pokemon with a height of 4 and a weight of 60',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Handle pokemon_info for unknown pokemon', () => {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_info')
          .withSlotResolution('pokemon', 'pika', 'pokemon', '')
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

  describe('Handle pokemon_info with incorrect pokemon slot', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(skillSettings, 'pokemon_info')
          .withSlotResolution('pokemon_wrong', 'pika', 'pokemon', '')
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
});
