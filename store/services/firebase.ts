import { api } from './api';

export const firebase = api.injectEndpoints({
  endpoints: (build) => ({
    initFirebase: build.query<string, void>({
      query: () => ({
        url: `init_firebase_auth`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useInitFirebaseQuery } = firebase;

export const {
  endpoints: { initFirebase },
} = firebase;
