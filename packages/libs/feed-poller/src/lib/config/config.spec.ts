jest.mock('@fbwrld/env-json');

async function importEnvVar() {
  return (await import('./env-var')).default;
}

function addEnvVars(envVars: object) {
  process.env = { ...process.env, ...envVars };
}

describe('envVar', () => {
  const envCopy = { ...process.env };
  const validEnvVars = {
    BASE_URL: 'http://localhost:5050',
    API_KEY: 'SUPER-SECRET-TOKEN',
  };

  beforeEach(() => {
    process.env = { ...envCopy };
  });
  it('Should have a valid BASE_URL', async () => {
    addEnvVars(validEnvVars);
    const envVar = await importEnvVar();
    expect(envVar.baseUrl).toBe(validEnvVars.BASE_URL);
  });

  it('Should have a valid BASE_URL', async () => {
    addEnvVars(validEnvVars);
    const envVar = await importEnvVar();
    expect(envVar.apiKey).toBe(validEnvVars.API_KEY);
  });

  // it.each([undefined, ''])(
  //   'Should throw if BASE_URL is not provided',
  //   async (value: string | undefined) => {
  //     addEnvVars(validEnvVars);
  //     process.env.BASE_URL = value;
  //     await importEnvVar().catch((error) => {
  //       expect(error).toBeDefined();
  //     });
  //     expect.assertions(1);
  //   }
  // );
});
