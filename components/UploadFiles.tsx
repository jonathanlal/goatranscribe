import { Button } from 'frostbyte';
import { Dropzone } from './Dropzone';
import {
  useLazyGetUploadUrlQuery,
  useLazyGetUploadsQuery,
  useUploadCompletedMutation,
} from 'store/services/upload';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import {
  MultipleUploadsStatus,
  UploadStatusFields,
} from 'interfaces/UploadStatus';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAudioDurationFromFile } from 'utils/getAudioDurationFromFile';
import { formatBytes } from 'utils/formatBytes';

export const UploadFiles = () => {
  const [getUploads] = useLazyGetUploadsQuery();
  const [getUploadUrl] = useLazyGetUploadUrlQuery();
  const [uploadCompleted] = useUploadCompletedMutation();

  const [status, setStatus] = useImmer<MultipleUploadsStatus>({});

  const [files, setFiles] = useState<File[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const { user } = useUser();

  const updateProgressStatus = (
    entryId: string,
    statusUpdate: UploadStatusFields
  ) => {
    setStatus((prevStatuses) => {
      const newStatuses = { ...prevStatuses };
      newStatuses[entryId] = {
        ...newStatuses[entryId],
        ...statusUpdate,
      };
      return newStatuses;
    });
  };

  const fetchSasUrl = async (numFiles: number) => {
    const { sasUrl, entryKeys } = await getUploadUrl({ numFiles }).unwrap();
    return entryKeys.map((entryKey) => ({ entryKey, sasUrl }));
  };

  const uploadFile = async (file: File, { entryKey, sasUrl }) => {
    const fileSize = formatBytes(file.size);
    const fileName = file.name;
    const duration = await getAudioDurationFromFile(file);

    const blobService = new BlobServiceClient(sasUrl);
    const containerClient: ContainerClient = blobService.getContainerClient(
      user.id as string
    );
    const blobClient = containerClient.getBlockBlobClient(`audio/${entryKey}`);

    try {
      const options = {
        blobHTTPHeaders: { blobContentType: file.type },
        onProgress: (progressEvent) => {
          const percentage = Math.ceil(
            (progressEvent.loadedBytes / file.size) * 100
          );

          updateProgressStatus(entryKey, {
            description: 'Uploading file',
            currentStatus: 'loading',
            fileName,
            fileSize,
            uploadProgress: percentage,
          });
        },
      };
      await blobClient.uploadData(file, options);

      await blobClient.setMetadata({
        fileName: file.name,
        fileExtension: `.${file.name.split('.').pop()}`,
        duration: duration.toString(),
      });

      await uploadCompleted({ entryKey }).unwrap();
    } catch (error) {
      console.error('Error uploading data:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    setHasStarted(true);
    //fetch sasUrl and all the file entryKeys
    const uploadParams = await fetchSasUrl(files.length);

    //Upload all the files in parallel.
    await Promise.all(
      files.map((file, index) => uploadFile(file, uploadParams[index]))
    );

    try {
      //triggers Uploads component to show new uploads
      await getUploads().unwrap();
      setStatus({});
    } catch (e) {
      //something went wrong toast
    }

    setHasStarted(false);
  };

  return (
    <>
      <Dropzone
        hasFinishedUploading={hasStarted === false}
        multipleStatus={status}
        maxFiles={100}
        setFiles={setFiles}
        multiple
      />
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
