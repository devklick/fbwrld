import { z } from 'zod';
import { dateTimeString } from './common-schemas';

const now = new Date();

const defaultDateFrom = new Date(now.setDate(now.getDate() - 1));
defaultDateFrom.setHours(0, 0, 0, 0);

const defaultDateTo = new Date(now.setDate(now.getDate() + 1));
defaultDateTo.setHours(23, 59, 59, 999);

export const eventDetailsSchema = z
  .object({
    dateFrom: dateTimeString().default(defaultDateFrom.toISOString()),
    dateTo: dateTimeString().default(defaultDateTo.toISOString()),
  })
  .default({});

export type EventDetails = z.infer<typeof eventDetailsSchema>;
