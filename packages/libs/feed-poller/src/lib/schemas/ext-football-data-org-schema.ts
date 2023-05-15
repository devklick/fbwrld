import { z } from 'zod';
import { dateTimeString } from './common-schemas';
/*
  Validation schemas and types for the objects returned
  from the football-data.org API.

  See: https://www.football-data.org
*/
const extCompetitionTypeSchema = z.enum(['CUP', 'LEAGUE']);

const extAreaSchema = z.object({
  id: z.number().min(0),
  name: z.string().nonempty(),
  code: z.string().max(3),
  flag: z.string().url(),
});

const extCompetitionSchema = z.object({
  id: z.number().min(0),
  name: z.string().nonempty(),
  code: z.string().nonempty().max(3),
  type: extCompetitionTypeSchema,
  emblem: z.string().url(),
});

const extSeasonSchema = z.object({
  id: z.number().min(0),
  startDate: dateTimeString(),
  endDate: dateTimeString(),
  currentMatchday: z.number().min(0),
  winner: z.unknown(), // TODO: Need to revisit this
});

const extTeamSchema = z.object({
  id: z.number().min(0),
  name: z.string().nonempty(),
  shortName: z.string().nonempty(),
  tla: z.string().nonempty().max(3),
  crest: z.string().url(),
});

const extScoreSchema = z.object({
  home: z.number().min(0).nullable(),
  away: z.number().min(0).nullable(),
});

const extResultSchema = z.object({
  winner: z.enum(['HOME_TEAM', 'AWAY_TEAM', 'DRAW']).nullable(),
  duration: z.enum(['REGULAR']),
  fullTime: extScoreSchema,
  halfTime: extScoreSchema,
});

const extRefereeSchema = z.object({
  id: z.number().min(0),
  name: z.string().nonempty(),
  type: z.enum(['REFEREE']),
  nationality: z.string().nullable(),
});

const extMatchStatusSchema = z.enum([
  'SCHEDULED',
  'TIMED',
  'IN_PLAY',
  'PAUSED',
  'FINISHED',
  'SUSPENDED',
  'POSTPONED',
  'CANCELLED',
  'AWARDED',
]);

const extMatchStageSchema = z.enum([
  'FINAL',
  'THIRD_PLACE',
  'SEMI_FINALS',
  'QUARTER_FINALS',
  'LAST_16',
  'LAST_32',
  'LAST_64',
  'ROUND_4',
  'ROUND_3',
  'ROUND_2',
  'ROUND_1',
  'GROUP_STAGE',
  'PRELIMINARY_ROUND',
  'QUALIFICATION',
  'QUALIFICATION_ROUND_1',
  'QUALIFICATION_ROUND_2',
  'QUALIFICATION_ROUND_3',
  'PLAYOFF_ROUND_1',
  'PLAYOFF_ROUND_2',
  'PLAYOFFS',
  'REGULAR_SEASON',
  'CLAUSURA',
  'APERTURA',
  'CHAMPIONSHIP_ROUND',
  'RELEGATION_ROUND',
]);

const extMatchGroupSchema = z.enum([
  'GROUP_A',
  'GROUP_B',
  'GROUP_C',
  'GROUP_D',
  'GROUP_E',
  'GROUP_F',
  'GROUP_G',
  'GROUP_H',
  'GROUP_I',
  'GROUP_J',
  'GROUP_K',
  'GROUP_L',
]);

const extMatchSchema = z.object({
  area: extAreaSchema,
  competition: extCompetitionSchema,
  season: extSeasonSchema,
  id: z.number().min(0),
  utcDate: dateTimeString(),
  status: extMatchStatusSchema,
  matchday: z.number().min(0).nullable(),
  stage: extMatchStageSchema,
  group: extMatchGroupSchema.nullable(),
  lastUpdated: dateTimeString(),
  homeTeam: extTeamSchema,
  awayTeam: extTeamSchema,
  score: extResultSchema,
  referees: z.array(extRefereeSchema),
});

export const getExtMatchesResultSchema = z.object({
  filters: z.record(z.string()),
  resultSet: z.object({
    count: z.number().min(0),
    competitions: z
      .string()
      .transform((arg) =>
        arg === null || arg === void 0 ? void 0 : arg.split(',')
      ),
    first: dateTimeString(),
    last: dateTimeString(),
    played: z.number(),
  }),
  matches: z.array(extMatchSchema),
});

export type GetExtMatchesResult = z.infer<typeof getExtMatchesResultSchema>;
export type ExtMatchStatus = z.infer<typeof extMatchStatusSchema>;
