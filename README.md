# PokeAPI Alexa skill

Alexa skill to get informaion about pokemons based on Pokemon APi https://pokeapi.co/docs/v2.html/.

## Development

For development purpose it is used `ask-sdk-express-adapter` https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs

General info about Alexa skill https://developer.amazon.com/en-US/docs/alexa/custom-skills/handle-requests-sent-by-alexa.html

More details on `ngrok` setup here https://developer.amazon.com/blogs/alexa/post/77c8f0b9-e9ee-48a9-813f-86cf7bf86747/setup-your-local-environment-for-debugging-an-alexa-skill

- switch to `lambda` dir

  - `cd lambda`

- install dependencies

  - `npm i`

- run tests

  - `npm run test`

- start `ngrok` in separate terminal session

  - `npm run ngrok`

- start express dev server

  - `npm run serve`

- use ASK ClI to test

  - `ask dialog --locale en-US`
