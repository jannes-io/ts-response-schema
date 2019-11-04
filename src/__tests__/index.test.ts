import { Schema } from 'ts-shallow-object-schema';
import { ApiErrorResponse, ApiOkResponse } from 'apisauce';
import { expect } from 'chai';
import { curryValidator, validateResponse } from '../';

const testData: unknown = {
  testString: 'hello',
  testInt: 5,
  testObj: {
    a: 'a',
    b: 1,
  },
  testArr: [1, 2, 3],
};

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

function okCall(): ApiOkResponse<unknown> {
  return {
    ok: true,
    problem: null,
    originalError: null,
    data: testData,
    status: 200,
    headers: {},
    duration: 10
  }
}

function nokCall(): ApiErrorResponse<unknown> {
  return {
    ok: false,
    problem: 'SERVER_ERROR',
    originalError: {
      name: '',
      message: '',
      config: {},
      isAxiosError: false
    },
    data: {},
    status: 200,
    headers: {},
    duration: 10
  }
}

describe('ts-response-schema', () => {
  const testSchemaValidator = curryValidator(testSchema);
  it('handles valid responses', () => {
    const validResponse = validateResponse(testSchemaValidator, okCall());
    expect(validResponse.ok).to.equal(true);
  });
  it('handles invalid responses', () => {
    const invalidResponse = validateResponse(testSchemaValidator, nokCall());
    expect(invalidResponse.ok).to.equal(false);
  });
  it('validates a valid response', () => {
    const validResponse = validateResponse(testSchemaValidator, okCall());
    expect(validResponse.data).to.equal(testData);
  });
  it('invalidates an invalid response', () => {
    const invalidCall = {...okCall(), data: { notAValidKey: '' }};
    const invalidResponse = validateResponse(testSchemaValidator, invalidCall);
    expect(invalidResponse.problem).to.equal('CLIENT_ERROR');
    expect(invalidResponse.data).to.equal('Validation failed');
  });
});
