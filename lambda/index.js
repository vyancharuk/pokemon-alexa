const { initSkillBuilder } = require('./src/common/initSkillBuilder');

exports.handler = initSkillBuilder().lambda();
