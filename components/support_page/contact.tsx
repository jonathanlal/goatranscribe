import { Button, styled } from 'frostbyte';
import { useState } from 'react';
import { StyledItem, StyledSelect } from 'styles/shared';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useSendSupportMutation } from 'store/services/support';

const TextArea = styled('textarea', {
  backgroundColor: '$mauve1',
  borderColor: '$mauve6',
  color: '$mauve12',
  width: '100%',
  resize: 'none',
  minHeight: 250,
  padding: '5px 10px',
  fontSize: 20,
});

const Panel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '5px',
  margin: '20px 0px',
  gap: '10px',
  padding: '10px',
  boxShadow: '0px 0px 0px 1px $colors$mauve8',
  background: '$green4',
  textAlign: 'center',
  // color: '$mauve4',

  '& span': {
    color: '$green9',
  },

  // variants: {
  //   isDarkTheme: {
  //     true: {
  //       backgroundColor: '$mauve1',
  //     },
  //     false: {
  //       backgroundColor: '$mauve2',
  //     },
  //   },
  // },
});

export const Contact = () => {
  const [sendSupport, { isLoading }] = useSendSupportMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    {
      label: string;
      value: string;
    }[]
  >(null);

  const [message, setMessage] = useState('');

  const options = [
    {
      label: 'Problem with website',
      value: 'problem',
    },

    {
      label: 'Balance issue',
      value: 'balance',
    },
    {
      label: 'General questions',
      value: 'general',
    },
    {
      label: 'Feature request',
      value: 'feature',
    },
  ];

  const isDisabled = selectedOption === null || message === '';

  const submitSupport = async () => {
    await sendSupport({
      message,
      reason: selectedOption[0].value,
    }).unwrap();
    setShowSuccess(true);
  };

  return (
    <>
      {!showSuccess ? (
        <>
          <StyledSelect
            placeholder="Select a reason"
            options={options}
            searchable={false}
            values={[]}
            style={{
              fontSize: 20,
            }}
            //   values={selectedOption}
            itemRenderer={({ item, methods }) => (
              <StyledItem onClick={() => methods.addItem(item)}>
                {item.label}
              </StyledItem>
            )}
            onChange={setSelectedOption}
          />
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: '100%',
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <span>Describe issue:</span>
            <TextArea
              name="postContent"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <Button
            color="grass6"
            fullWidth
            disabled={isDisabled || isLoading}
            loading={isLoading}
            css={{
              display: 'grid',
              placeItems: 'center', //fix loading position
            }}
            onClick={submitSupport}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PaperPlaneIcon width={25} height={25} style={{}} />{' '}
              <span>Submit</span>
            </div>
          </Button>
        </>
      ) : (
        <Panel>
          <span>
            Your message has been received, you will receive a response shortly.
          </span>
        </Panel>
      )}
    </>
  );
};
