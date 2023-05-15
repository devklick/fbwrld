import { Axios } from 'axios';
import envVar from '../config/env-var';
import {
  GetExtMatchesResult,
  ExtMatchStatus,
  getExtMatchesResultSchema,
} from '../schemas/ext-football-data-org-schema';
import { stringifyError } from '../utils/zod-utils';

function throwError(message: string): never {
  throw new Error(`Error in feed-poller football-data-org-service. ${message}`);
}

/*
  ===========================================================
  HTTP service that interacts with the football-data.org API.
  ===========================================================
*/

const http = new Axios({ baseURL: envVar.baseUrl });

/**
 * The parameters that can optionally be
 * provided when fetching matches.
 */
export type GetMatchesParams = Partial<{
  /**
   * Fetch only matches with the given ids
   */
  ids: Array<number>;
  /**
   * Fetch all matches for the given date
   */
  date: Date;
  /**
   * Fetch only matches who's `startDate` is
   * greater than or equal to the specified date.
   *
   * **Must be used in conjunction with `dateTo`**
   */
  dateFrom: Date;
  /**
   * Fetch only matches who's `startDate` is before
   * the specified date.
   *
   * **Must be used in conjunction with `dateFrom`**
   */
  dateTo: Date;
  /**
   * Fetch only matches that are currently in the specified status
   */
  status: ExtMatchStatus;
}>;

/**
 * Intercept all requests and add the
 * X-Auth-Token header with our API Key
 */
http.interceptors.request.use(function (config) {
  config.headers['X-Auth-Token'] = envVar.apiKey;
  return config;
});

/**
 * Fetch football matches from the API.
 * @param params The parameters to be included in the request.
 * @returns The matches found based on any specified criteria
 */
export async function getMatches(
  params: GetMatchesParams
): Promise<GetExtMatchesResult> {
  console.info(
    `Fetching matches from endpoint /matches, base URL ${envVar.baseUrl}`
  );
  const result = await http.get('/matches', {
    params: {
      dateFrom: params.dateFrom?.toISOString().substring(0, 10),
      dateTo: params.dateTo?.toISOString().substring(0, 10),
    },
  });

  console.info(`API response status ${result.status}`);

  const validation = getExtMatchesResultSchema.safeParse(
    JSON.parse(result.data)
  );
  if (!validation.success) {
    throwError(stringifyError(validation.error));
  }
  return validation.data;
}
