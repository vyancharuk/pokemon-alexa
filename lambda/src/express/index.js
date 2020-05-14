/*global process*/

const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const { initSkillBuilder } = require('../common/initSkillBuilder');

const { PORT = 3001 } = process.env;

const app = express();

// TODO: remove traceMidleware
const traceMiddleware = (req, res, next) => {
  const date = new Date();
  const ts = `${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

  console.log(`[${ts}]traceMiddleware req.headers=`, req.headers);

  req.on('data', (chunk) => {
    const bodydata = chunk.toString('utf8');
    console.log('bodydata =', JSON.parse(bodydata));
  });

  next();
};

const skillBuilder = initSkillBuilder();
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

app.post('/', traceMiddleware, adapter.getRequestHandlers());

app.listen(PORT, function (err) {
  if (err) {
    console.error(`Error during server startup ${err.toString()}`);
  }
  console.info(`Your server is ready on port ${PORT}`);
});
