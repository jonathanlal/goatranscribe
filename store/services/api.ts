import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// in client side, we don't need to specify the server url. On server side, absolute url is required.
const serverUrl =
  typeof window !== 'undefined'
    ? '/api/goat/'
    : (process.env.GOAT_API as string);

const baseQuery = fetchBaseQuery({
  baseUrl: serverUrl,
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['uploads', 'balance'],
});
