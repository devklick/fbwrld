import * as path from 'path';
import * as fs from 'fs';

type EnvJsonParams = {
  /**
   * The path to the JSON file containing environment variables.
   * This can either be a fully qualified path or relative to whichever
   * directory the code will be run from (most likely the repository root).
   */
  path: string;
  /**
   * The name of the JSON file containing environment variables.
   * Defaults to `local.env.json`
   */
  fileName?: string;
};

function processArray(key: string, value: Array<unknown>) {
  // Only supporting arrays of primitive values for now
  process.env[key] = value.join(';');
}

function processObject(file: string, key: string, value: object) {
  Object.entries(value).forEach(([k, v]) => {
    processEntry(file, `${key}.${k}`, v);
  });
}

function processPrimitive(
  key: string,
  value: boolean | number | string | undefined | null | unknown
) {
  process.env[key] = value?.toString();
}

const primitives = ['boolean', 'number', 'string', 'undefined'];

function isPrimitive(
  value: unknown
): value is boolean | number | string | undefined {
  return primitives.includes(typeof value);
}

/**
 *
 * @param file
 * @param key
 * @param value
 * @returns
 */
function processEntry(file: string, key: string, value: unknown): void {
  if (value === null || isPrimitive(value)) {
    return processPrimitive(key, value);
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return processArray(key, value);
    } else {
      return processObject(file, key, value);
    }
  }

  // Impossible to reach, since all JSON data types are supported by this module.
  console.warn(`Unsupported data type in ${file}, ${typeof value}`);
}

function throwError(message: string): never {
  throw new Error(`Error in env-json. ${message}`);
}
/**
 * Loads the specified JSON file (if it exists) and adds the keys and values to `process.env`.
 * @param params The function parameters
 */
export function config(params: EnvJsonParams): void {
  const file = path.join(
    process.cwd(),
    params.path,
    params.fileName ?? 'local.env.json'
  );
  if (!fs.existsSync(file)) return;

  console.info(`Loading environment variables from ${file}`);

  const raw = fs.readFileSync(file, {
    encoding: 'utf8',
  });

  let json: Record<string, string>;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    throwError(`File ${file} appears to contain invalid JSON\n${message}`);
  }

  for (const key in json) {
    if (process.env[key]) {
      console.warn(`Environment variable ${key} already defined. Skipping`);
    } else {
      processEntry(file, key, json[key]);
    }
  }
}
