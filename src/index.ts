import { ApiErrorResponse, ApiOkResponse, ApiResponse } from 'apisauce';
import isValidData, { Schema } from 'ts-shallow-object-schema';

interface InvalidApiResponse extends ApiErrorResponse<string> {
  data: 'Validation failed';
}

interface ValidApiResponse<T> extends ApiOkResponse<T> {
  data: T;
}

export type ResponseWithData<T> =
  ValidApiResponse<T> |
  ApiErrorResponse<unknown> |
  InvalidApiResponse;

export function curryValidator<T>(schema: Schema<T>): (data: unknown) => data is T {
  return (data): data is T => isValidData(schema, data);
}

export function validateResponse<T>(
  validator: (d: unknown) => d is T,
  response: ApiResponse<unknown>,
): ResponseWithData<T> {
  if (!response.ok) {
    return response as ApiErrorResponse<unknown>;
  }

  const { data } = response;
  if (validator(data)) {
    return {
      ...response,
      data,
    };
  }

  return {
    ...response,
    ok: false,
    data: 'Validation failed',
    problem: 'CLIENT_ERROR',
    originalError: {},
  } as InvalidApiResponse;
}
