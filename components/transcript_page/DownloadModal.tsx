import { DownloadIcon } from '@radix-ui/react-icons';
import { Button, H, Modal, P, styled } from 'frostbyte';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { useGetBalanceQuery } from 'store/services/balance';
import { useTranslateEntriesMutation } from 'store/services/translate';
import { COST_PER_CHARACTER } from 'utils/constants';
import { LANGUAGES, LanguageCode } from 'utils/translateLanguages';
import { CSSTransition } from 'react-transition-group';
import { useLazyGetDownloadLinkQuery } from 'store/services/download';

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

export const DownloadModal = ({
  setDownloadModal,
  downloadModal,
  entryKey,
  targetLang,
  file_name,
}) => {
  const [selectedDownloadOptions, setSelectedDownloadOption] = useState('');
  const [getDownloadLink, { data: downloadLink, isLoading, isSuccess }] =
    useLazyGetDownloadLinkQuery();
  //   console.log('selectedLanguages', selectedLanguages);

  const downloadOptions = [
    {
      label: 'Text file',
      value: 'txt',
    },
    {
      label: 'Subtitle file',
      value: 'srt',
    },
  ];

  const onGetDownloadLink = async () => {
    await getDownloadLink({
      entryKey,
      targetLang,
      format: selectedDownloadOptions,
    }).unwrap();
  };

  useEffect(() => {
    if (downloadLink) {
      var link = document.createElement('a');
      link.href = downloadLink;
      link.download = file_name;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [downloadLink]);

  return (
    <Modal setOpen={setDownloadModal} open={downloadModal}>
      <br />
      <Select
        disabled={isLoading}
        options={downloadOptions}
        values={[]}
        onChange={(value) => setSelectedDownloadOption(value[0].value)}
      />
      <br />
      <Button
        color="grass6"
        fullWidth
        css={{
          zIndex: 10,
          display: 'grid',
          placeItems: 'center', //fix loading position
        }}
        loading={isLoading}
        disabled={isLoading || !selectedDownloadOptions}
        onClick={onGetDownloadLink}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <DownloadIcon
            width={30}
            height={30}
            style={{
              marginTop: '3px',
            }}
          />
          <span>Download</span>
        </div>
      </Button>
    </Modal>
  );
};
