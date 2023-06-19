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
      invalidatesTags: ['balance'],
    }),
    transcriptSeen: build.query<void, { entryKey: string }>({
      query: ({ entryKey }) => ({
        url: `transcript_seen`,
        method: 'POST',
        body: { entryKey },
      }),
    }),
    transcriptsSeen: build.mutation<void, { taskIds: string[] }>({
      query: ({ taskIds }) => ({
        url: `transcripts_seen`,
        method: 'POST',
        body: { taskIds },
      }),
    }),
    retryFailedTranscribe: build.mutation<void, { entryKey: string }>({
      query: ({ entryKey }) => ({
        url: `retry_failed_transcribe`,
        method: 'POST',
        body: { entryKey },
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

export const {
  useTranscribeEntriesMutation,
  useGetTranscribeStatusQuery,
  useTranscriptsSeenMutation,
  useTranscriptSeenQuery,
  useRetryFailedTranscribeMutation,
} = transcribe;

export const {
  endpoints: {
    transcribeEntries,
    retryFailedTranscribe,
    getTranscribeStatus,
    transcriptSeen,
    transcriptsSeen,
  },
} = transcribe;
