import { api } from './api';
import { Upload } from 'interfaces/Upload';

export const upload = api.injectEndpoints({
  endpoints: (build) => ({
    getUploadUrl: build.query<
      { sasUrl: string; entryKeys: string[] },
      { numFiles: number }
    >({
      query: ({ numFiles }) => ({
        url: `sasUrl`,
        method: 'POST',
        body: { numFiles },
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
  useLazyGetUploadsQuery,
} = upload;

export const {
  endpoints: { getUploadUrl, uploadCompleted, getUploads },
} = upload;
