import { EOL } from 'os';
import { z } from 'zod';

export function stringifyError(zodError: z.ZodError): string {
  return zodError.errors
    .map(({ code, message, path }) => `${code} | ${path} | ${message}`)
    .join(EOL);
}
