import { PlayIcon } from '@radix-ui/react-icons';
import { Button, H, Modal, P, styled } from 'frostbyte';
import { useEffect, useState } from 'react';
import { useGetBalanceQuery } from 'store/services/balance';
import { COST_PER_CHARACTER } from 'utils/constants';
import { CSSTransition } from 'react-transition-group';
import { useParagraphTranscriptMutation } from 'store/services/paragraph';

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

  width: '100%',
  zIndex: 1,

  '& p:first-child b:first-child': {
    color: '$tomato9',
  },
});

export const ParagraphModal = ({
  setAddParagraphModal,
  addParagraphModal,
  entryKey,
  char_count,
  setParagraphTaskLoading,
}) => {
  const [cost, setCost] = useState(0);
  const [hasFunds, setHasFunds] = useState(true);
  const [createParagraphed, { isLoading: paragraphLoading }] =
    useParagraphTranscriptMutation();

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
    setParagraphTaskLoading(true);
    const { instanceId } = await createParagraphed({
      entryKey,
    }).unwrap();
    setAddParagraphModal(false);
  };
  //   console.log('selectedLanguages', selectedLanguages);

  return (
    <Modal setOpen={setAddParagraphModal} open={addParagraphModal}>
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
        disabled={!hasFunds || paragraphLoading}
        loading={paragraphLoading}
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
