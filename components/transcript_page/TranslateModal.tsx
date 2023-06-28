import { PlayIcon } from '@radix-ui/react-icons';
import { Button, H, Modal, P, styled } from 'frostbyte';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { useGetBalanceQuery } from 'store/services/balance';
import { useTranslateEntriesMutation } from 'store/services/translate';
import { COST_PER_CHARACTER } from 'utils/constants';
import { LANGUAGES, LanguageCode } from 'utils/translateLanguages';
import { CSSTransition } from 'react-transition-group';
import { StyledItem } from 'styles/shared';

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

export const TranslateModal = ({
  setAddTranslationModal,
  addTranslationModal,
  entryKey,
  translations,
  char_count,
  setTranslateTaskLoading,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [cost, setCost] = useState(0);
  const [hasFunds, setHasFunds] = useState(true);
  const [translateEntries, { isLoading: translateEntriesLoading }] =
    useTranslateEntriesMutation();

  const { data: balance } = useGetBalanceQuery();

  useEffect(() => {
    const calculateCost = async () => {
      let totalCost = selectedLanguages.reduce(
        (acc, item) => acc + char_count * COST_PER_CHARACTER,
        0
      );

      const estimatedCost = Math.ceil(totalCost * 100) / 100;

      setCost(estimatedCost);

      setHasFunds(balance >= totalCost);
    };

    if (selectedLanguages.length > 0 && balance !== undefined) {
      //   if (selectedLanguages.length > 0 && balance !== undefined) {
      calculateCost();
    } else {
      setCost(0);
      setHasFunds(true);
    }
  }, [selectedLanguages.length, balance]);

  //   console.log('translations', translations);
  const languageOptions = Object.keys(LANGUAGES)
    .filter((code) => !translations.includes(code))
    .map((code) => ({
      label: LANGUAGES[code as LanguageCode],
      value: code,
    }));

  const startTranslation = async () => {
    setTranslateTaskLoading(true);
    const { instanceId } = await translateEntries({
      entryKeys: [entryKey],
      targetLangs: selectedLanguages.map((lang) => lang.value),
    }).unwrap();
    setSelectedLanguages([]);
    setAddTranslationModal(false);
  };
  //   console.log('selectedLanguages', selectedLanguages);

  return (
    <Modal setOpen={setAddTranslationModal} open={addTranslationModal}>
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
      <H color="purple9" css={{ marginBottom: '0px' }}>
        Select languages:
      </H>
      <P
        size="20"
        color="purple8"
        css={{
          marginBottom: '10px',
        }}
      >
        Select the languages you want to translations for
      </P>
      <Select
        multi
        options={languageOptions}
        values={selectedLanguages}
        disabled={translateEntriesLoading}
        closeOnSelect={true}
        itemRenderer={({ item, methods }) => (
          <StyledItem onClick={() => methods.addItem(item)}>
            <input
              onChange={() => methods.addItem(item)}
              type="checkbox"
              checked={methods.isSelected(item)}
            />{' '}
            {item.label}
          </StyledItem>
        )}
        onChange={setSelectedLanguages}
      />
      <ClearButtonWrapper>
        <Button
          size="xs"
          color="mauve6"
          onClick={() => setSelectedLanguages([])}
          disabled={translateEntriesLoading || selectedLanguages.length == 0}
        >
          Clear
        </Button>
      </ClearButtonWrapper>
      <br />
      <Button
        onClick={startTranslation}
        disabled={
          !hasFunds || selectedLanguages.length == 0 || translateEntriesLoading
        }
        loading={translateEntriesLoading}
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
