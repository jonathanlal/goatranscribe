import { H, useFrostbyte } from 'frostbyte';
import { useGetTransactionsQuery } from 'store/services/balance';
import { CustomTable } from './CustomTable';
import { formatDistanceToNow } from 'date-fns';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

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
      {isSuccess && (
        <>
          <CustomTable
            headerItems={['Description', 'Amount', 'Time']}
            items={data.map((t) => ({
              entry_id: t.id,
              data: [
                t.description,
                `$${t.amount}`,
                formatDistanceToNow(new Date(parseInt(t.created) * 1000), {
                  addSuffix: true,
                }),
              ],
            }))}
          />
        </>
      )}
    </>
  );
};
