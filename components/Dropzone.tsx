import { CheckCircledIcon, UploadIcon } from '@radix-ui/react-icons';
import { P, styled, useFrostbyte } from 'frostbyte';
import { UploadStatus } from 'interfaces/UploadStatus';
import { DropzoneState } from 'react-dropzone';
import { formatBytes } from 'utils/formatBytes';
import Spinner from './Spinner';

const Container = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  borderRadius: '5px',
  // boxShadow: '$colors$purple6 0px 8px 5px 3px',
  background: 'rgb(153, 86, 213, 0.2)',
  // background: 'rgb(153, 86, 213, 0.8)',
  minHeight: '400px',
  // color: '$primaryContrast',
  // minHeight: '250px',
  outline: 'none',
  transition: 'box-shadow 0.3s ease-in-out',

  '&:hover': {
    cursor: 'pointer',
  },

  '&:hover, &:focus': {
    background: 'rgb(153, 86, 213, 0.2)',

    boxShadow: '$colors$purple8 0px 0px 0px 3px',
  },

  variants: {
    hasFiles: {
      true: {
        display: 'flow-root',

        // backgroundImage:
        //   'linear-gradient(rgba(153, 86, 213, 0.1), rgba(153, 86, 213, 0.1)), url(goatranscribe-opacity.svg)',
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        // backgroundSize: 'contain',
        // backgroundSize: '200px 200px',
        // cursor: 'wait',
        boxShadow: '$colors$purple8 0px 0px 0px 3px',

        '&:hover': {
          backgroundImage:
            'linear-gradient(rgba(153, 86, 213, 0.1), rgba(153, 86, 213, 0.1)), url(goatranscribe-opacity.svg)',
          backgroundSize: '200px 200px',
        },
      },
    },
  },
});

const StatusList = styled('ul', {
  padding: '0',
  listStyle: 'none',
});

const StatusListItem = styled('li', {
  padding: '10px',
  boxShadow: '$colors$purple6 0px 0px 0px 2px',
  textAlign: 'left',
  marginBottom: '8px',
  borderRadius: '5px',
  paddingLeft: '20px',
  backgroundColor: '$purple2',
  color: '$purple11',
  fontWeight: '600',
  fontSize: '17px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const FileItemStatus = styled('div', {
  padding: '10px',
  boxShadow: '$colors$purple6 0px 0px 0px 2px',
  textAlign: 'left',
  marginBottom: '8px',
  borderRadius: '5px',
  paddingLeft: '20px',
  backgroundColor: '$purple11',
  color: '$purple1',
  fontWeight: '600',
  fontSize: '17px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StyledCheckCircledIcon = styled(CheckCircledIcon, {
  color: '$grass9',
  width: '24px',
  height: '24px',
});

const DropzoneInfo = styled('div', {
  //   backgroundColor: 'hsl(279deg 43.8% 23.3% / 48%)',
  boxShadow: '$colors$purple8 0px 0px 5px 3px',
  padding: '20px',
  borderRadius: '25px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  //   color: '#fff',
  fontSize: '18px',
  fontWeight: '600',
  variants: {
    isDarkTheme: {
      true: {
        color: '$purple1',
        backgroundColor: '#ffffff48',
      },
      false: {
        color: '$purple1',
        backgroundColor: 'hsl(279deg 43.8% 23.3% / 48%)',
      },
    },
  },
});

export const Dropzone = ({
  dropState,
  status,
}: {
  dropState: DropzoneState;
  status: UploadStatus[];
}) => {
  const { isDarkTheme } = useFrostbyte();
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = dropState;

  const hasFiles = acceptedFiles.length > 0;

  const file = acceptedFiles[0];

  return (
    <Container {...getRootProps()} hasFiles={hasFiles}>
      {file && (
        <FileItemStatus>
          <p>{file.name}</p>
          <p>{formatBytes(file.size)}</p>
        </FileItemStatus>
      )}

      {status && (
        <StatusList>
          {Object.keys(status).map((key) => (
            <StatusListItem key={key}>
              <p>
                {status[key].description}{' '}
                {status[key]?.timeTaken && `(${status[key]?.timeTaken}s)`}
              </p>
              {status[key].currentStatus === 'loading' ? (
                <Spinner />
              ) : (
                <StyledCheckCircledIcon />
              )}
            </StatusListItem>
          ))}
        </StatusList>
      )}
      <input {...getInputProps()} />
      {!hasFiles && (
        <DropzoneInfo isDarkTheme={isDarkTheme}>
          <span>
            Drag & drop a file here, <br /> or click to select one.
          </span>
          <UploadIcon width={25} height={25} />
        </DropzoneInfo>
      )}
    </Container>
  );
};
