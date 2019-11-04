# TS Response Schema

Combines [TS Object Schema](https://www.npmjs.com/package/ts-shallow-object-schema)
and [apisauce](https://www.npmjs.com/package/apisauce) to create the ultimate type-safe api experience.

![License](https://img.shields.io/github/license/jannes-io/ts-response-schema)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue)](https://www.typescriptlang.org/) 

## Usage

```typescript
import { Schema } from 'ts-shallow-object-schema';
import { createApi } from 'apisauce';
import { curryValidator, validateResponse } from '../';

interface ITest {
  testString: string;
  testInt: number;
  testObj: object;
  testArr: number[];
  testOptional?: number;
}

const testSchema: Schema<ITest> = [{
  key: 'testString',
  type: 'string',
}, {
  key: 'testInt',
  type: 'number',
}, {
  key: 'testObj',
  type: 'object',
}, {
  key: 'testArr',
  type: 'array',
}, {
  key: 'testOptional',
  type: 'number',
  optional: true,
}];

const api = createApi({
  baseURL: 'https://example.com/',
});

const testSchemaValidator = curryValidator(testSchema);

// Example of a valid response:
const res = validateResponse(testSchemaValidator, api.get(''));
if (res.ok) {
  // Strict types now ensure that `res.data` is of type `ITest`
  // So we can safely use it as such
  console.log(res.data.testString);
}

// Example of an invalid response
const res2 = validateResponse(testSchemaValidator, api.get(''));
if (!res2.ok && res2.data === 'Validation failed') {
  // Strict types now ensure that the API did return a response.
  // But the response was not a valid `ITest`
  console.error('Invalid response', res2);
}
```