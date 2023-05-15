export const emptyObject = {} as const;

export const flatObjectOnlyPrimitives = {
  stringValue: 'string value',
  numberValue: 123,
  booleanValue: true,
  nullValue: null,
} as const;

export const objectWithArray = {
  arrayValue: [1, 2, 3],
} as const;

export const nestedObjects = {
  nestedObjectValue: {
    ...flatObjectOnlyPrimitives,
  } as const,
} as const;
