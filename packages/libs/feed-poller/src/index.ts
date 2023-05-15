import { EventBridgeEvent } from 'aws-lambda';
import {
  EventDetails,
  eventDetailsSchema,
} from './lib/schemas/event-bridge-schema';
import { stringifyError } from './lib/utils/zod-utils';
import { getMatches } from './lib/services/football-data-org-service';

function throwError(message: string): never {
  throw new Error(`Error in feed-poller handler. ${message}`);
}
export async function handler({
  detail,
}: EventBridgeEvent<'PollFeed', Partial<EventDetails>>): Promise<void> {
  const validation = eventDetailsSchema.safeParse(detail);
  if (!validation.success) {
    throwError(stringifyError(validation.error));
  }
  const { dateFrom, dateTo } = validation.data;
  const matches = await getMatches({ dateFrom, dateTo });
  // TODO: Publish each match to SNS
  console.log(matches);
}
