import { Button, H } from 'frostbyte';
import { Dropzone } from './Dropzone';
import {
  useLazyGetUploadUrlQuery,
  useUploadCompletedMutation,
} from 'store/services/upload';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { UploadStatus } from 'interfaces/UploadStatus';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAudioDurationFromFile } from 'utils/getAudioDurationFromFile';
// import { COST_PER_SECOND, COST_PER_SECOND_WHISPER } from 'utils/constants';
// import { formatDuration } from 'date-fns';
// import { formatDuration } from 'utils/formatDuration';
// import { formatDuration } from 'date-fns';

export const UploadFiles = () => {
  const [status, setStatus] = useImmer<UploadStatus[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const { user } = useUser();

  console.log('USER: ', user);

  const [getUploadUrl] = useLazyGetUploadUrlQuery();
  const [uploadCompleted] = useUploadCompletedMutation();

  const handleUpload = async () => {
    setHasStarted(true);

    //get file
    const file = files[0];

    // const whisperCost = duration * COST_PER_SECOND_WHISPER;
    // console.log('estimated cost to goat', whisperCost);

    // console.log('profit', estimatedCost - whisperCost);

    // get upload url
    const duration = await getAudioDurationFromFile(file);
    console.log('duration', duration);
    const { entryKey, sasUrl } = await getUploadUrl().unwrap();
    console.log('1');
    //upload to azure
    const blobService = new BlobServiceClient(sasUrl);
    const containerClient: ContainerClient = blobService.getContainerClient(
      user.id as string
    );
    const blobClient = containerClient.getBlockBlobClient(`audio/${entryKey}`);
    console.log('2');
    try {
      const options = {
        blobHTTPHeaders: { blobContentType: file.type },
        onProgress: (progressEvent) => {
          const percentage = Math.ceil(
            (progressEvent.loadedBytes / file.size) * 100
          );
          // setProgress(percentage);
        },
      };
      await blobClient.uploadData(file, options);
      console.log('3');
      await blobClient.setMetadata({
        fileName: file.name,
        fileExtension: `.${file.name.split('.').pop()}`,
        duration: duration.toString(),
      });
      console.log('4');
      await uploadCompleted({ entryKey }).unwrap();
      setFiles([]);
      setStatus([]);
      console.log('5');
    } catch (error) {
      console.error('Error uploading data:', error);
      throw error;
    }

    setHasStarted(false);
  };
  return (
    <>
      {/* <H>Total cost: ${cost}</H>
      <H>Total duration: {totalDuration}</H> */}
      <Dropzone status={status} maxFiles={10} setFiles={setFiles} multiple />
      {files.length > 0 && (
        <Button
          type="button"
          onClick={handleUpload}
          fullWidth
          loading={hasStarted}
          css={{
            display: 'grid',
            placeItems: 'center', //fix loading position
            marginTop: '20px',
          }}
        >
          Upload Files
        </Button>
      )}
    </>
  );
};
