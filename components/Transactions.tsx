import { H, P, styled, useFrostbyte } from 'frostbyte';
import { useGetTransactionsQuery } from 'store/services/balance';
import { CustomTable } from './CustomTable';
import { formatDistanceToNow } from 'date-fns';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Amount = styled('span', {
  fontWeight: 700,
  variants: {
    isNegative: {
      true: {
        color: '$red9',
      },
      false: {
        color: '$green9',
      },
    },
  },
});
export const Transactions = () => {
  const { data, isFetching, isSuccess } = useGetTransactionsQuery();
  const { isDarkTheme } = useFrostbyte();

  return (
    <>
      {/* <br /> */}
      {/* <H>Transactions</H> */}
      {isFetching && (
        <SkeletonTheme
          baseColor={isDarkTheme ? '#161618' : ''}
          highlightColor={isDarkTheme ? '#1F1F1F' : ''}
        >
          <Skeleton
            width="100%"
            height="300px"
            style={{
              marginTop: '20px',
            }}
          />
        </SkeletonTheme>
      )}
      {isSuccess &&
        (data.length > 0 ? (
          <>
            <CustomTable
              headerItems={['Transaction', 'Amount', 'Time', 'Balance']}
              items={data.map((t) => ({
                entry_id: t.id,
                data: [
                  t.description,
                  <Amount isNegative={t.is_cost}>${t.amount}</Amount>,
                  t.date,
                  `$${t.new_balance}`,
                ],
              }))}
            />
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              margin: '20px 0',
            }}
          >
            <P size="20" color="mauve9">
              No transactions to show yet
            </P>
          </div>
        ))}
    </>
  );
};
