import { z } from 'zod';

export function dateTimeString() {
  return z.string().pipe(z.coerce.date());
}
