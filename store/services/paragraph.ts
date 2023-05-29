import { api } from './api';

export const paragraph = api.injectEndpoints({
  endpoints: (build) => ({
    paragraphTranscript: build.mutation<
      { instanceId: string; message: string },
      { entryKey: string }
    >({
      query: ({ entryKey }) => ({
        url: `paragraph`,
        method: 'POST',
        body: { entryKey },
      }),
      invalidatesTags: ['balance'],
    }),
    getParagraphed: build.query<string, { entryKey: string }>({
      query: ({ entryKey }) => ({
        url: `get_paragraphed`,
        method: 'POST',
        body: { entryKey },
      }),
    }),
  }),
});

export const { useParagraphTranscriptMutation, useLazyGetParagraphedQuery } =
  paragraph;

export const {
  endpoints: { getParagraphed, paragraphTranscript },
} = paragraph;
