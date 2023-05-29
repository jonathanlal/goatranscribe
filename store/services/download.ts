import { api } from './api';

export const download = api.injectEndpoints({
  endpoints: (build) => ({
    getDownloadLink: build.query<
      string,
      { entryKey: string; targetLang: string; format: string }
    >({
      query: ({ entryKey, targetLang, format }) => ({
        url: `get_download_link`,
        method: 'POST',
        body: { entryKey, targetLang, format },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazyGetDownloadLinkQuery } = download;

export const {
  endpoints: { getDownloadLink },
} = download;
