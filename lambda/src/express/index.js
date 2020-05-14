/*global process*/

const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const { initSkillBuilder } = require('../common/initSkillBuilder');

const { PORT = 3001 } = process.env;

const app = express();

const skillBuilder = initSkillBuilder();
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

app.post('/', adapter.getRequestHandlers());

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error during server startup ${err.toString()}`);
  }
  console.info(`Your server is ready on port ${PORT}`);
});
