import { api } from './api';

export const summary = api.injectEndpoints({
  endpoints: (build) => ({
    createSummary: build.mutation<
      { instanceId: string; message: string },
      { entryKey: string }
    >({
      query: ({ entryKey }) => ({
        url: `summarize`,
        method: 'POST',
        body: { entryKey },
      }),
      invalidatesTags: ['balance'],
    }),
    getSummary: build.query<string, { entryKey: string }>({
      query: ({ entryKey }) => ({
        url: `get_summary`,
        method: 'POST',
        body: { entryKey },
      }),
    }),
  }),
});

export const { useCreateSummaryMutation, useLazyGetSummaryQuery } = summary;

export const {
  endpoints: { createSummary, getSummary },
} = summary;
