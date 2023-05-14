import { api } from './api';
import { Upload } from 'interfaces/Upload';

export const upload = api.injectEndpoints({
  endpoints: (build) => ({
    getUploadUrl: build.query<{ sasUrl: string; entryKey: string }, void>({
      query: () => ({
        url: `sasUrl`,
      }),
      keepUnusedDataFor: 0,
    }),
    uploadCompleted: build.mutation<void, { entryKey: string }>({
      query: ({ entryKey }) => ({
        url: `uploadComplete`,
        body: { entryKey },
        method: 'POST',
      }),
      invalidatesTags: ['uploads'],
    }),
    getUploads: build.query<Upload[], void>({
      query: () => ({
        url: `uploads`,
        method: 'POST',
      }),
      keepUnusedDataFor: 0,
      providesTags: ['uploads'],
    }),
  }),
});

export const {
  useGetUploadUrlQuery,
  useLazyGetUploadUrlQuery,
  useUploadCompletedMutation,
  useGetUploadsQuery,
} = upload;

export const {
  endpoints: { getUploadUrl, uploadCompleted, getUploads },
} = upload;
