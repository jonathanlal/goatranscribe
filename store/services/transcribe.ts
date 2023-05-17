import { api } from './api';

export const transcribe = api.injectEndpoints({
  endpoints: (build) => ({
    transcribeEntries: build.mutation<
      { instanceId: string; message: string },
      { entryKeys: string[] }
    >({
      query: ({ entryKeys }) => ({
        url: `transcribe`,
        method: 'POST',
        body: { entryKeys },
      }),
    }),
    getTranscribeStatus: build.query<
      { status: string; output: string },
      { transcribeTaskId: string; entryKeys: string[] }
    >({
      query: ({ transcribeTaskId, entryKeys }) => ({
        url: `transcribeStatus`,
        method: 'POST',
        body: { instanceId: transcribeTaskId },
      }),
      // transformResponse: (response) => {
      //   // we should check response against entryKeys and see if all have status: complete
      // }
    }),
  }),
});

export const { useTranscribeEntriesMutation, useGetTranscribeStatusQuery } =
  transcribe;

export const {
  endpoints: { transcribeEntries, getTranscribeStatus },
} = transcribe;
