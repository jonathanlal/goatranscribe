import { PlayIcon } from '@radix-ui/react-icons';
import { Button, H, Modal, P, styled } from 'frostbyte';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { useGetBalanceQuery } from 'store/services/balance';
import { useTranslateEntriesMutation } from 'store/services/translate';
import { COST_PER_CHARACTER } from 'utils/constants';
import { LANGUAGES, LanguageCode } from 'utils/translateLanguages';
import { CSSTransition } from 'react-transition-group';
import { useCreateSummaryMutation } from 'store/services/summary';

// padding: 10px;
// color: #555;
// border-radius: 3px;
// margin: 3px;
// cursor: pointer;
// > div {
//   display: flex;
//   align-items: center;
// }

// input {
//   margin-right: 10px;
// }

// :hover {
//   background: #f2f2f2;
// }

const StyledItem = styled('div', {
  padding: '10px',
  color: '#555',
  borderRadius: '3px',
  margin: '3px',
  cursor: 'pointer',
  '& > div': {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginRight: '10px',
  },
  '& :hover': {
    background: '#f2f2f2',
  },
});

const PrimaryPanel = styled('div', {
  textAlign: 'center',
  borderRadius: '5px',
  gap: '10px',
  padding: '20px',
  boxShadow: '$colors$primary 0px 0px 3px 2px',
  background: '$purple3',
  color: '$primary',
  marginTop: '20px',
  marginBottom: '10px',
  fontSize: 22,
  //   position: 'fixed',
  //   bottom: 0,
  // width: '100vw',
  //   width: 'calc(100% - 10vw)', // Subtract left and right padding
  width: '100%',
  zIndex: 1,

  '& p:first-child b:first-child': {
    color: '$tomato9',
  },
});

const ClearButtonWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '10px',
});

export const SummaryModal = ({
  setAddSummaryModal,
  addSummaryModal,
  entryKey,
  char_count,
  setSummaryTaskLoading,
}) => {
  const [cost, setCost] = useState(0);
  const [hasFunds, setHasFunds] = useState(true);
  const [createSummary, { isLoading: summaryLoading }] =
    useCreateSummaryMutation();

  const { data: balance } = useGetBalanceQuery();

  useEffect(() => {
    const calculateCost = async () => {
      let totalCost = char_count * COST_PER_CHARACTER;

      const estimatedCost = Math.ceil(totalCost * 100) / 100;

      setCost(estimatedCost);

      setHasFunds(balance >= totalCost);
    };

    if (balance !== undefined) {
      calculateCost();
    } else {
      setCost(0);
      setHasFunds(true);
    }
  }, [balance]);

  const startSummary = async () => {
    setSummaryTaskLoading(true);
    const { instanceId } = await createSummary({
      entryKey,
    }).unwrap();
    setAddSummaryModal(false);
  };
  //   console.log('selectedLanguages', selectedLanguages);

  return (
    <Modal setOpen={setAddSummaryModal} open={addSummaryModal}>
      <CSSTransition
        in={cost > 0}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <PrimaryPanel>
          <P
            css={
              {
                // marginBottom: '10px',
              }
            }
          >
            Total cost: <b>${cost}</b>
          </P>
        </PrimaryPanel>
      </CSSTransition>

      <br />
      <Button
        onClick={startSummary}
        disabled={!hasFunds || summaryLoading}
        loading={summaryLoading}
        color="grass6"
        fullWidth
        css={{
          zIndex: 10,
          display: 'grid',
          placeItems: 'center', //fix loading position
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <PlayIcon
            width={30}
            height={30}
            style={{
              marginTop: '3px',
            }}
          />
          <span>Start</span>
        </div>
      </Button>
    </Modal>
  );
};
