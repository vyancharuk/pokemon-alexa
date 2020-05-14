/*global describe*/
const {
  AlexaTest,
  IntentRequestBuilder,
  LaunchRequestBuilder,
} = require('ask-sdk-test');

const { handler } = require('../../index');
const { LAUNCH_MSG } = require('../common/constants');

// initialize the testing framework
const skillSettings = {
  appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  userId: 'amzn1.ask.account.VOID',
  deviceId: 'amzn1.ask.device.VOID',
  locale: 'en-US',
};

const alexaTest = new AlexaTest(handler, skillSettings);

describe('Pokemon Skills', function () {
  describe('LaunchRequest', () => {
    alexaTest.test([
      {
        request: new LaunchRequestBuilder(skillSettings).build(),
        says: LAUNCH_MSG,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Handles AMAZON.HelpIntent', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(
          skillSettings,
          'AMAZON.HelpIntent'
        ).build(),
        saysLike: 'Here something you can ask me',
        repromptsLike: 'Would you like to continue, yes or no?',
        shouldEndSession: false,
        hasAttributes: {
          afterHelp: true,
        },
      },
    ]);
  });

  describe('AMAZON.HelpIntent contains proper examples', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(
          skillSettings,
          'AMAZON.HelpIntent'
        ).build(),
        saysLike: 'tell me about Pikachu',
        repromptsNothing: false,
        shouldEndSession: false,
        hasAttributes: {
          afterHelp: true,
        },
      },
    ]);
  });

  describe('AMAZON.NoIntent should end session after AMAZON.HelpIntent', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(
          skillSettings,
          'AMAZON.NoIntent'
        ).build(),
        says: 'Okay, talk to you later!',
        repromptsNothing: false,
        shouldEndSession: true,
        withSessionAttributes: {
          afterHelp: true,
        },
      },
    ]);
  });

  describe('AMAZON.FallbackIntent should have proper speech', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(
          skillSettings,
          'AMAZON.FallbackIntent'
        ).build(),
        saysLike: "Sorry, I don't know about that. Say help for some options?",
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('AMAZON.StopIntent should end session', function () {
    alexaTest.test([
      {
        request: new IntentRequestBuilder(
          skillSettings,
          'AMAZON.StopIntent'
        ).build(),
        says: 'Goodbye!',
        repromptsNothing: false,
        shouldEndSession: true,
      },
    ]);
  });
});
