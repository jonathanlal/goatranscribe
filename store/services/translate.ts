import { api } from './api';

export const translate = api.injectEndpoints({
  endpoints: (build) => ({
    translateEntries: build.mutation<
      { instanceId: string; message: string },
      { entryKeys: string[]; targetLangs: string[] }
    >({
      query: ({ entryKeys, targetLangs }) => ({
        url: `translate`,
        method: 'POST',
        body: { entryKeys, targetLangs },
      }),
      invalidatesTags: ['balance'],
    }),
    // transcriptSeen: build.query<void, { entryKey: string }>({
    //   query: ({ entryKey }) => ({
    //     url: `transcript_seen`,
    //     method: 'POST',
    //     body: { entryKey },
    //   }),
    // }),
    // transcriptsSeen: build.mutation<void, { taskIds: string[] }>({
    //   query: ({ taskIds }) => ({
    //     url: `transcripts_seen`,
    //     method: 'POST',
    //     body: { taskIds },
    //   }),
    // }),
    // getTranscribeStatus: build.query<
    //   { status: string; output: string },
    //   { transcribeTaskId: string; entryKeys: string[] }
    // >({
    //   query: ({ transcribeTaskId, entryKeys }) => ({
    //     url: `transcribeStatus`,
    //     method: 'POST',
    //     body: { instanceId: transcribeTaskId },
    //   }),
    //   // transformResponse: (response) => {
    //   //   // we should check response against entryKeys and see if all have status: complete
    //   // }
    // }),
  }),
});

export const { useTranslateEntriesMutation } = translate;

export const {
  endpoints: { translateEntries },
} = translate;
