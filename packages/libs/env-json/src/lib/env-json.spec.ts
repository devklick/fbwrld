import * as fs from 'fs';
import * as envJson from './env-json';
import {
  flatObjectOnlyPrimitives,
  nestedObjects,
  objectWithArray,
} from './env-json.spec.data';

jest.mock('fs');

const mockFs = jest.mocked(fs, true);

describe('envJson', () => {
  describe('envJson.config', () => {
    const path = 'some/file/path';
    const fileName = 'some-file.env.json';
    const mockCwd = 'mock/cwd';
    const fullFilePath = mockCwd + '/' + path + '/' + fileName;

    let cwdSpy: jest.SpyInstance;
    // eslint-disable-next-line prefer-const
    let envCopy = { ...process.env };

    beforeEach(() => {
      process.env = { ...envCopy };
      cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);
      mockFs.existsSync.mockReturnValue(true);
    });

    afterEach(() => {
      cwdSpy.mockRestore();
      jest.resetAllMocks();
    });

    it('should build the path to the json file', () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      envJson.config({ path, fileName });
      expect(mockFs.existsSync).toBeCalledWith(fullFilePath);
    });

    it('should not try to read a a non existent file', () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      envJson.config({ path, fileName });
      expect(mockFs.readSync).not.toBeCalled();
    });

    it('should throw an error when the file contains invalid JSON', () => {
      mockFs.readFileSync.mockReturnValueOnce('NOT JSON');
      const expected = new Error(
        'File mock/cwd/some/file/path/some-file.env.json appears to contain invalid JSON\nUnexpected token N in JSON at position 0'
      );
      expect(() => envJson.config({ path, fileName })).toThrowError(expected);
    });

    it('should not overwrite existing environment variables', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const varName: keyof typeof flatObjectOnlyPrimitives = 'stringValue';
      const oldValue = flatObjectOnlyPrimitives.stringValue + 'OLD';
      process.env[varName] = oldValue;

      mockFs.readFileSync.mockReturnValueOnce(
        JSON.stringify(flatObjectOnlyPrimitives)
      );
      envJson.config({ path, fileName });
      expect(process.env[varName]).toBe(oldValue);
      expect(consoleWarnSpy).toBeCalledWith(
        `Environment variable ${varName} already defined. Skipping`
      );
    });

    it('should load primitive values into process.env', () => {
      mockFs.readFileSync.mockReturnValueOnce(
        JSON.stringify(flatObjectOnlyPrimitives)
      );
      envJson.config({ path, fileName });
      expect(process.env['stringValue']).toBe(
        flatObjectOnlyPrimitives.stringValue
      );
      expect(process.env['numberValue']).toBe(
        flatObjectOnlyPrimitives.numberValue.toString()
      );
      expect(process.env['booleanValue']).toBe(
        String(flatObjectOnlyPrimitives.booleanValue)
      );
      expect(process.env['nullValue']).toBeUndefined();
    });

    it('Should load arrays into process.env', () => {
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(objectWithArray));
      envJson.config({ path, fileName });
      expect(process.env['arrayValue']).toBe('1;2;3');
    });

    it('should load nested objects into process.env with dot-notated keys', () => {
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(nestedObjects));
      envJson.config({ path, fileName });
      expect(process.env['nestedObjectValue.stringValue']).toBe(
        flatObjectOnlyPrimitives.stringValue
      );
      expect(process.env['nestedObjectValue.numberValue']).toBe(
        flatObjectOnlyPrimitives.numberValue.toString()
      );
      expect(process.env['nestedObjectValue.booleanValue']).toBe(
        String(flatObjectOnlyPrimitives.booleanValue)
      );
      expect(process.env['nestedObjectValue.nullValue']).toBeUndefined();
    });
  });
});
