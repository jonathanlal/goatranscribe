import { api } from './api';

export const balance = api.injectEndpoints({
  endpoints: (build) => ({
    getBalance: build.query<number, void>({
      query: () => ({
        url: `get_customer_balance`,
      }),
      providesTags: ['balance'],
      transformResponse: (response: { balance: number }) => response.balance,
    }),
    addCredit: build.query<
      {
        registered_amount: number;
        intent_id: string;
        client_secret: string;
      },
      { amount: number; intent_id?: string }
    >({
      query: ({ amount, intent_id }) => ({
        url: `add_wallet_credit`,
        params: { amount, intent_id },
      }),
      // invalidatesTags: ['balance'], //convert to mutation
      keepUnusedDataFor: 0,
    }),
    getTransactions: build.query<
      {
        id: string;
        amount: number;
        description: string;
        date: string;
        is_cost: boolean;
        new_balance: number;
      }[],
      void
    >({
      query: () => ({
        url: `get_customer_transactions`,
      }),
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useAddCreditQuery,
  useGetTransactionsQuery,
} = balance;

export const {
  endpoints: { getBalance, addCredit },
} = balance;
