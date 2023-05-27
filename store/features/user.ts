import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Upload } from 'interfaces/Upload';
import { getBalance } from 'store/services/balance';
import { getUploads } from 'store/services/upload';

interface User {
  balance: number;
  uploads: Upload[];
  tasksLoading: boolean;
}

const initialState: User = {
  balance: null,
  uploads: [],
  tasksLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUploads: (state, action: PayloadAction<Upload[]>) => {
      state.uploads = action.payload;
    },
    setTasksLoading: (state, action: PayloadAction<boolean>) => {
      state.tasksLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(getBalance.matchFulfilled, (state, action) => {
      state.balance = action.payload;
    });
    builder.addMatcher(getBalance.matchFulfilled, (state, action) => {
      state.balance = action.payload;
    });
    builder.addMatcher(getUploads.matchFulfilled, (state, action) => {
      state.uploads = action.payload;
    });
  },
});

export const {
  actions: { setUploads, setTasksLoading },
} = userSlice;
