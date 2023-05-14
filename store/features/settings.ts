import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Settings {
  darkMode: boolean;
}

const initialState: Settings = {
  darkMode:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  actions: { setDarkMode },
} = settingsSlice;
