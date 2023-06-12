import { api } from './api';

export const support = api.injectEndpoints({
  endpoints: (build) => ({
    sendSupport: build.mutation<void, { message: string; reason: string }>({
      query: ({ message, reason }) => ({
        url: `send_support`,
        method: 'POST',
        body: {
          message,
          reason,
        },
      }),
    }),
  }),
});

export const { useSendSupportMutation } = support;

export const {
  endpoints: { sendSupport },
} = support;
