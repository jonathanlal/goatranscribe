import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import toWav from 'audiobuffer-to-wav';
import { TranscribeResponse } from 'interfaces/TranscribeResponse';
import {
  UploadStatus,
  UploadStatusFields,
  UploadStatusKey,
} from 'interfaces/UploadStatus';
import { getAudioDurationFromFile } from './getAudioDurationFromFile';
import { formatBytes } from './formatBytes';

async function getFirstMinute(audioFile: File): Promise<File> {
  const audioContext = new window.AudioContext();

  const arrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result as ArrayBuffer);
    reader.readAsArrayBuffer(audioFile);
  });

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const duration = audioBuffer.duration;
  const firstMinuteDuration = Math.min(duration, 60);
  const samplesToTake = Math.floor(
    firstMinuteDuration * audioBuffer.sampleRate
  );

  const firstMinuteBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    samplesToTake,
    audioBuffer.sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const inputData = audioBuffer.getChannelData(channel);
    const outputData = firstMinuteBuffer.getChannelData(channel);
    outputData.set(inputData.subarray(0, samplesToTake));
  }

  // Encode the first minute AudioBuffer to WAV
  const wavData = toWav(firstMinuteBuffer);

  // Create a Blob from the WAV data
  const wavBlob = new Blob([wavData], { type: 'audio/wav' });

  // Convert the Blob to a File
  const fileName = `first_minute_${audioFile.name}`;
  const firstMinuteFile = new File([wavBlob], fileName, { type: 'audio/wav' });

  return firstMinuteFile;
}

interface SasUrlResponse {
  sasUrl: string;
  entryKey: string;
}

//redo this shit to use rtk query
async function postSasUrl(): Promise<SasUrlResponse> {
  try {
    const response = await fetch('/api/try/sasUrl', {
      method: 'POST',
      body: JSON.stringify({ numFiles: 1 }),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching SAS URL:', error);
    throw error;
  }
}

async function postUploadComplete(entryKey: string): Promise<void> {
  try {
    await fetch('/api/try/uploadComplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryKey }),
    });
  } catch (error) {
    console.error('Error posting upload complete:', error);
    throw error;
  }
}

interface TranscribeApiResponse {
  data: TranscribeResponse;
}

async function postTranscribe(
  entryKey: string
): Promise<TranscribeApiResponse> {
  try {
    const response = await fetch('/api/try/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryKey }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting transcribe:', error);
    throw error;
  }
}
// async function handleUploadData(blobClient: BlockBlobClient, newFile: File, fileSize: number, setProgress: (percentage: number) => void): Promise<void> {
// async function handleUploadData(
//   blobClient: BlockBlobClient,
//   newFile: File,
//   fileSize: number
// ): Promise<void> {
//   try {
//     const fileType = newFile.type;
//     const options = {
//       blobHTTPHeaders: { blobContentType: fileType },
//       onProgress: (progressEvent) => {
//         const percentage = Math.ceil(
//           (progressEvent.loadedBytes / fileSize) * 100
//         );
//         // setProgress(percentage);
//       },
//     };
//     await blobClient.uploadData(newFile, options);
//   } catch (error) {
//     console.error('Error uploading data:', error);
//     throw error;
//   }
// }

interface TryGoatProps {
  file: File;
  // setProgress: (percentage: number) => void;
  // setIsUploading: (isUploading: boolean) => void;
  setResponse: (data: TranscribeResponse) => void;
  updateStatus: (entryId: string, statusUpdate: UploadStatusFields) => void;
}

const getTimeTaken = (start: number, end: number): number =>
  parseFloat(((end - start) / 1000).toFixed(1));

export const tryGoat = async ({
  file,
  // setProgress,
  // setIsUploading,
  setResponse,
  updateStatus,
}: TryGoatProps): Promise<void> => {
  try {
    const sasUrlStart = performance.now();
    updateStatus('sas', {
      description: 'Provisioning upload url',
      currentStatus: 'loading',
    });
    const { sasUrl, entryKey } = await postSasUrl();
    updateStatus('sas', {
      description: 'Upload url ready',
      timeTaken: getTimeTaken(sasUrlStart, performance.now()),
      currentStatus: 'success',
    });

    const getFirstMinuteStart = performance.now();
    updateStatus('minute', {
      description: 'Getting first minute from audio file',
      currentStatus: 'loading',
      fileName: file.name,
      fileSize: formatBytes(file.size),
    });

    const newFile = await getFirstMinute(file);
    const fileName = newFile.name;
    const fileSize = newFile.size;
    const fileExtension = `.${newFile.name.split('.').pop()}`;

    updateStatus('minute', {
      description: 'First minute retrieved',
      currentStatus: 'success',
      timeTaken: getTimeTaken(getFirstMinuteStart, performance.now()),
      fileSize: formatBytes(fileSize),
    });

    updateStatus('upload', {
      description: 'Uploading 1 minute audio file',
      currentStatus: 'loading',
    });

    const blobService = new BlobServiceClient(sasUrl);
    const containerClient: ContainerClient = blobService.getContainerClient(
      'try' as string
    );
    const blobClient = containerClient.getBlockBlobClient(`audio/${entryKey}`);

    const uploadStart = performance.now();
    // await handleUploadData(blobClient, newFile, fileSize, setProgress);
    // await handleUploadData(blobClient, newFile, fileSize);

    try {
      const options = {
        blobHTTPHeaders: { blobContentType: newFile.type },
        onProgress: (progressEvent) => {
          const percentage = Math.ceil(
            (progressEvent.loadedBytes / newFile.size) * 100
          );

          updateStatus('upload', {
            description: 'Uploading file',
            currentStatus: 'progress',
            fileName,
            fileSize: fileSize.toString(),
            uploadProgress: percentage,
          });
        },
      };
      await blobClient.uploadData(newFile, options);

      const duration = await getAudioDurationFromFile(newFile);

      await blobClient.setMetadata({
        fileName,
        fileExtension,
        duration: duration.toString(),
      });
    } catch (error) {
      console.error('Error uploading data:', error);
      throw error;
    }
    // setIsUploading(false);

    // await blobClient.setMetadata({
    //   fileName,
    //   fileExtension,
    //   duration: duration.toString(),
    // });
    await postUploadComplete(entryKey);

    updateStatus('upload', {
      description: 'Upload completed',
      timeTaken: getTimeTaken(uploadStart, performance.now()),
      currentStatus: 'success',
    });

    updateStatus('transcribe', {
      description: 'Transcribing audio file',
      currentStatus: 'loading',
    });
    const transcribeStart = performance.now();
    const transcribeData = await postTranscribe(entryKey);
    updateStatus('transcribe', {
      description: 'Transcript completed',
      timeTaken: getTimeTaken(transcribeStart, performance.now()),
      currentStatus: 'success',
    });
    setResponse(transcribeData.data);
  } catch (err) {
    console.log(err);
  }
};
