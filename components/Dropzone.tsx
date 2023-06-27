import { CheckCircledIcon, UploadIcon } from '@radix-ui/react-icons';
import { P, Seperator, styled, useFrostbyte } from 'frostbyte';
import { MultipleUploadsStatus, UploadStatus } from 'interfaces/UploadStatus';
import { DropzoneState, useDropzone } from 'react-dropzone';
import { formatBytes } from 'utils/formatBytes';
import Spinner from './Spinner';
import { useEffect } from 'react';
import { event as gaEvent } from 'nextjs-google-analytics';
import { StyledLink } from 'styles/shared';
import { event } from 'nextjs-google-analytics';
import { useRouter } from 'next/router';

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
  '@mdMax': {
    minHeight: '250px',
  },
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

  '& > p:first-child': {
    textOverflow: 'ellipsis',
    overflowWrap: 'anywhere !important',
  },
  '& > p:last-child': {
    textAlign: 'right',
  },
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
  letterSpacing: '1px',
  //   color: '#fff',
  fontSize: '16px',
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

const ErrorPanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '5px',
  gap: '10px',
  padding: '20px',
  boxShadow: '$colors$tomato7 0px 0px 3px 2px',
  background: '$tomato4',
  color: '$tomato9',
  marginBottom: '20px',
});

export const Dropzone = ({
  hasFinishedUploading,
  status,
  maxFiles,
  multiple,
  setFiles,
  multipleStatus,
}: {
  hasFinishedUploading?: boolean;
  // status?: UploadStatus[];
  status?: MultipleUploadsStatus;
  maxFiles: number;
  multiple: boolean;
  setFiles: (files: File[]) => void;
  multipleStatus?: MultipleUploadsStatus;
}) => {
  const { isDarkTheme } = useFrostbyte();
  const router = useRouter();

  const acceptedFilesInApp = {
    'audio/aac': ['.aac'],
    'audio/flac': ['.flac'],
    'audio/mpeg': ['.mp3', '.mpg', '.mpeg', '.mpga'],
    'audio/mp4': ['.m4a'],
    'audio/ogg': ['.ogg', '.oga'],
    'audio/wav': ['.wav'],
    'audio/webm': ['.webm'],
    'audio/x-matroska': ['.mka'],
    'video/mp4': ['.mp4', '.m4v'],
    'video/mpeg': ['.mpeg', '.mpg'],
    'video/ogg': ['.ogv'],
    'video/webm': ['.webm'],
    'video/x-matroska': ['.mkv'],
    'video/x-flv': ['.flv'],
    'video/3gpp': ['.3gp', '.3g2'],
    'video/quicktime': ['.mov'],
    'video/x-msvideo': ['.avi'],
  };

  const acceptedTryFiles = {
    'audio/mp4': ['.m4a', '.mp4'],
    'audio/mpeg': ['.mp3', '.mpeg', '.mpga'],
    'audio/wav': ['.wav'],
    'audio/webm': ['.webm'],
  };
  const dropState = useDropzone({
    maxFiles,
    multiple,
    onError: (err) => {
      console.log('err', err);
      //show toast
    },
    onDropAccepted(files, event) {
      setFiles(files);

      if (maxFiles === 1) {
        gaEvent('file', {
          category: 'cta',
          label: 'file_accepted',
        });
      }
    },

    // autoFocus: true,
    accept: maxFiles === 1 ? acceptedTryFiles : acceptedFilesInApp,
    // disabled: status
    //   ? status.length > 0
    //   : Object.keys(multipleStatus).length > 0,
    disabled: status
      ? Object.keys(status).length > 0
      : Object.keys(multipleStatus).length > 0,
  });

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = dropState;

  useEffect(() => {
    if (hasFinishedUploading) {
      acceptedFiles.length = 0;
      acceptedFiles.splice(0, acceptedFiles.length);
      setFiles([]);
    }
  }, [hasFinishedUploading]);

  const hasFiles = acceptedFiles.length > 0;

  const singleFile = acceptedFiles[0];

  const hasMultipleUploadStarted =
    multipleStatus && Object.keys(multipleStatus).length > 0;

  const goToApp = () => {
    event('click', {
      category: 'cta',
      label: 'bad_file_type_cta',
    });
    router.push('/transcribe');
  };

  return (
    <>
      {fileRejections.length > 0 && (
        <ErrorPanel>
          <P color="tomato9" size="20" weight="600">
            File type in trial mode not supported 😞
          </P>
          {/* <P color="tomato10" size="16">
            Allowed types in trial: .mp3 .mp4 .mpeg .wav, .m4a
          </P> */}
          <Seperator orientation="horizontal" height="2px" color="tomato8" />
          <StyledLink onClick={goToApp} color="black" underline>
            Click here to transcribe any file type in the app
          </StyledLink>
        </ErrorPanel>
      )}

      <Container {...getRootProps()} hasFiles={hasFiles}>
        {maxFiles === 1 && singleFile && (
          <FileItemStatus>
            <p>{singleFile.name}</p>
            <p>{formatBytes(singleFile.size)}</p>
          </FileItemStatus>
        )}

        {maxFiles > 1 && hasFiles && !hasMultipleUploadStarted && (
          <>
            {acceptedFiles.map((file) => (
              <FileItemStatus key={file.name}>
                <p>{file.name}</p>
                <p>{formatBytes(file.size)}</p>
              </FileItemStatus>
            ))}
          </>
        )}

        {maxFiles > 1 &&
          hasFiles &&
          hasMultipleUploadStarted &&
          Object.keys(multipleStatus).map((entryId) => {
            const { fileName, fileSize, uploadProgress } =
              multipleStatus[entryId];
            return (
              <FileItemStatus key={entryId}>
                <p>{fileName}</p>
                <p
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  {uploadProgress != 100 && <Spinner />}
                  {uploadProgress}%
                </p>
              </FileItemStatus>
            );
          })}
        {/* {status && status.length > 0 && ( */}
        {status && Object.keys(status).length > 0 && (
          <StatusList>
            {Object.keys(status).map((key) => (
              <StatusListItem key={key}>
                <p>
                  {status[key].description}{' '}
                  {status[key]?.timeTaken && `(${status[key]?.timeTaken}s)`}
                </p>
                {status[key].currentStatus === 'loading' && <Spinner />}
                {status[key].currentStatus === 'success' && (
                  <StyledCheckCircledIcon />
                )}
                {status[key].currentStatus === 'progress' && (
                  <p
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    {status[key].uploadProgress != 100 && <Spinner />}
                    {status[key].uploadProgress}%
                  </p>
                )}
              </StatusListItem>
            ))}
          </StatusList>
        )}
        <input {...getInputProps()} />
        {!hasFiles && (
          <DropzoneInfo isDarkTheme={isDarkTheme}>
            <span>
              Drag & drop {multiple ? 'files' : 'a file here'}, <br /> or click
              to select{multiple ? '.' : ' one.'}
            </span>
            <UploadIcon width={25} height={25} />
          </DropzoneInfo>
        )}
      </Container>
    </>
  );
};
