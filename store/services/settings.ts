import { api } from './api';

export const settings = api.injectEndpoints({
  endpoints: (build) => ({
    getUserSettings: build.query<{ uploads_welcome: boolean }, void>({
      query: () => ({
        url: `get_settings`,
        method: 'POST',
      }),
      providesTags: ['settings'],
    }),
    seenUploadsWelcome: build.mutation<void, void>({
      query: () => ({
        url: `seen_uploads_welcome_page`,
        method: 'POST',
      }),
      invalidatesTags: ['settings'],
    }),
  }),
});

export const { useGetUserSettingsQuery, useSeenUploadsWelcomeMutation } =
  settings;

export const {
  endpoints: { getUserSettings, seenUploadsWelcome },
} = settings;
