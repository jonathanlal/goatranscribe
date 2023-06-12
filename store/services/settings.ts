import { EmailTypes } from 'interfaces/EmailTypes';
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
    updateEmailPreferences: build.mutation<
      void,
      { emailType: EmailTypes; isChecked: boolean }
    >({
      query: ({ emailType, isChecked }) => ({
        url: `update_email_preferences`,
        method: 'POST',
        body: {
          emailType,
          isChecked,
        },
      }),
      invalidatesTags: ['settings'],
    }),
  }),
});

export const {
  useGetUserSettingsQuery,
  useSeenUploadsWelcomeMutation,
  useUpdateEmailPreferencesMutation,
} = settings;

export const {
  endpoints: { getUserSettings, seenUploadsWelcome, updateEmailPreferences },
} = settings;
