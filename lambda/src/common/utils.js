const Pokedex = require('pokedex-promise-v2');
const _ = require('lodash');
const pokeApi = new Pokedex();

const cacheManager = require('cache-manager');
const memoryCache = cacheManager.caching({
  store: 'memory',
  max: 100,
  ttl: 24 * 60 * 60 * 1000 /* one day, in seconds */,
});

const REQUEST_TIMEOUT = 7000;
const allowedTraits = ['type', 'height', 'weight'];

const getTraitForm = (trait) => {
  if (trait === 'height') {
    return 'high';
  }

  return trait;
};

const getSlotValue = (slot) => {
  if (
    _.isNil(slot) ||
    _.isNil(slot.resolutions) ||
    _.isNil(slot.resolutions.resolutionsPerAuthority) ||
    _.isNil(slot.resolutions.resolutionsPerAuthority[0])
  ) {
    return null;
  }

  const resolvedSlotValue =
    !_.isNil(slot.resolutions.resolutionsPerAuthority[0].values) &&
    slot.resolutions.resolutionsPerAuthority[0].values.length > 0
      ? slot.resolutions.resolutionsPerAuthority[0].values[0].value
      : null;
  return resolvedSlotValue ? resolvedSlotValue.name : slot.value;
};

const fetchPokemonInfo = async (name) => {
  const pokeInfo = await pokeApi.getPokemonByName(name).catch((response) => {
    if (response.toString().indexOf('404') > -1) {
      return null;
    }
    throw new Error('BAD_RESPONSE');
  });

  return pokeInfo
    ? Object.keys(pokeInfo)
        .filter((trait) => allowedTraits.indexOf(trait) > -1)
        .reduce(
          (result, trait) => {
            result[trait] = pokeInfo[trait];
            return result;
          },
          {
            type: Array.isArray(pokeInfo.types)
              ? pokeInfo.types.map((t) => t.type.name).join(', ')
              : 'unknown',
          }
        )
    : null;
};

const getPokemonInfo = async (pokeName) => {
  // cache in memory by name
  return memoryCache.wrap(pokeName, function () {
    return Promise.race([
      fetchPokemonInfo(pokeName),
      // timeout request to PokePAI to 7 seconds, because default request timeout for alex skill is 8 seconds
      // https://forums.developer.amazon.com/questions/189755/increasing-the-expectedspeech-timeout-8-seconds-fo.html
      new Promise((resolve, reject) => {
        setTimeout(reject, REQUEST_TIMEOUT, 'POKEAPI_TIMEOUT_ERROR');
      }),
    ]);
  });
};

const cleanupSessionAttrs = (sessionAttributes) => {
  delete sessionAttributes.unknownPokemon;
  delete sessionAttributes.unknownTrait;
  delete sessionAttributes.afterHelp;
};

module.exports = {
  getTraitForm,
  getSlotValue,
  getPokemonInfo,
  cleanupSessionAttrs,
};
