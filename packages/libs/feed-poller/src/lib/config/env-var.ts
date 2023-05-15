import { z } from 'zod';
import envJson from '@fbwrld/env-json';
import { stringifyError } from '../utils/zod-utils';

envJson.config({ path: 'packages/libs/feed-poller' });

function throwError(message: string): never {
  throw new Error(`Error in feed-poller env-var. ${message}`);
}
function get<Schema extends z.ZodType<unknown, z.ZodTypeDef>>(
  name: string,
  schema: Schema
): z.infer<typeof schema> {
  const value = process.env[name];
  const validation = schema.safeParse(value);
  if (validation.success) return validation.data;
  throwError(stringifyError(validation.error));
}

const envVar = {
  baseUrl: get('BASE_URL', z.string().url().nonempty()),
  apiKey: get('API_KEY', z.string().nonempty()),
};

export default envVar;
