<h1 align="center">
    EnvJson
</h1>

<p align="center">
    Store env files as JSON
</p>
<br/>
<br/>
<br/>
<br/>

# Description

As an alternative to storing environment variables in the usual `.env` files, this package allows you to store them in `.json` files and load them at runtime.

# Reasoning

I found that when using [Serverless](https://www.serverless.com/) to deploy multiple applications, where the application source live in an [Nx](https://nx.dev/) monorepo and _each application has it's environment variables_, I was unable to control which environment variables were loaded into which application. Storing these environment variables in a json file allows me to:
- Easily import them into an application when running locally (not quite as easy as [dotenv](https://www.npmjs.com/package/dotenv), but easy enough)
- Easily load a specific file and specify an exact variable in my Serverless YAML file

# Usage

Before your code tries to access environment variables via  `process.env`, you must import `env-json` and call the `config()` function, e.g. 

```js
import envJson from '@fbwrld/env-json';

envJson.config({
  /**
   * The path to the JSON file containing environment variables.
   * This can either be a fully qualified path or relative to whichever
   * directory the code will be run from (most likely the repository root).
   */
  fileName: 'some.env.json',
  /**
   * The name of the JSON file containing environment variables.
   * Defaults to `local.env.json`
   */
  path: 'some/app/src'
});
```

Now, whenever your code runs it'll look for this file, and if found, it'll read the contents and load all JSON properties into `process.env` as key-value pairs.

## Note

If a variable already exists in `process.env` at runtime, it will _not_ be overwritten.

# Referencing in Serverless.yaml

In order to load your environment variables into your application at build time using Serverless, you can import it with the `file()` Serverless function and either load the entire file contents as the function's environment variables or load individual variables. 

## Load all variables

```yml
functions:
  myFunc:
    # ...
    environment: ${file(some/app/src/${opt:stage, 'local'}.env.json)}
```
## Load specific variables

```yml
functions:
  myFunc:
    # ...
    environment: 
      SOME_VAR: ${file(some/app/src/${opt:stage, 'local'}.env.json):SOME_KEY_FROM_FILE}
```
