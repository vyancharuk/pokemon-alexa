const LAUNCH_MSG =
  'Welcome, you can ask anything about any Pokemon or say help to hear some options. Which would you like to try?';
const PROMPT = 'What else would you like to know?';
const POKEMON_SLOT = 'pokemon';
const TRAIT_SLOT = 'trait';

const POKE_MAP = {
  pikachu: {
    height: 4,
    weight: 60,
    type: 'electric',
  },
  charizard: {
    height: 3,
    weight: 2,
    type: 'fly',
  },
};

module.exports = {
  LAUNCH_MSG,
  PROMPT,
  POKEMON_SLOT,
  POKE_MAP,
  TRAIT_SLOT,
};
