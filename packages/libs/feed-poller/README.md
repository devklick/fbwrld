<h1 align="center">
    Feed Poller
</h1>

<p align="center">
    Fetch football match data from football-data.org
</p>
<br/>
<br/>
<br/>
<br/>

# Description

This library is intended to be run as an AWS Lambda function which fetches football match data from an external data provider, [football-data.org](https://www.football-data.org/)

# Configuration

## Environment Variables

The following environment variables are supported.

| Name     | Description                                                                   | Requirement |
| -------- | ----------------------------------------------------------------------------- | ----------- |
| BASE_URL | The base URL for making requests to the football-data.org API.                | Required    |
| API_KEY  | The API key that should be used to authenticate against football-data.org API | Required    |

## Environment Variables (local)

Environment variables can be configured via a `local.env.json` file. See the [env-json lib](../env-json/README.md) for more on this.

## Event Bridge Event

Because this function is intended to be triggered via an AWS Event Bridge event, input parameters can be specified at run time. The following parameters are supported.

| Name     | Description                                                                   | Requirement | Default |
| -------- | ----------------------------------------------------------------------------- | ----------- | ---|
| dateFrom |    Fetch only matches who's `startDate` is greater than or equal to the specified date. **Must be used in conjunction with `dateTo`**               | Optional    | Start of yesterday
| dateTo  | Fetch only matches who's `startDate` is before the specified date. **Must be used in conjunction with `dateFrom`**    | Optional | End of tomorrow

# Running Locally

Once you have your local environment variables set up, you can run the code locally by executing the following command:

```
npx nx run-local feed-poller
```

This will execute the [local.ts](./src/local.ts) file. This file can be tweaked as required to run whatever you want to run. You can add breakpoints and step through code, etc.
