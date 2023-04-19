import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import axios from 'axios';
import { Subtitle } from 'interfaces/Subtitle';
import toWav from 'audiobuffer-to-wav';

async function getFirstMinute(audioFile: File) {
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

export const tryGoat = async ({
  file,
  setProgress,
  setIsUploading,
  setData,
}) => {
  try {
    console.log('trygoat');
    const newFile = await getFirstMinute(file);
    console.log('newfile', newFile);
    const fileName = newFile.name;
    const fileSize = newFile.size;
    const fileType = newFile.type;
    const fileExtension = `.${newFile.name.split('.').pop()}`;

    // const fileURL = URL.createObjectURL(newFile);
    // console.log('fileURL', fileURL);
    // return fileURL;
    axios.post('/api/try/sasUrl').then(async (response) => {
      console.log('response', response);
      const { sasUrl, entryKey } = response.data.data; //wtf
      console.log('sasUrl', sasUrl);
      console.log('entryKey', entryKey);

      const blobService = new BlobServiceClient(sasUrl);
      const containerClient: ContainerClient = blobService.getContainerClient(
        'try' as string
      );
      const blobClient = containerClient.getBlockBlobClient(
        `audio/${entryKey}`
      );
      const options = {
        blobHTTPHeaders: { blobContentType: fileType },
        onProgress: (progressEvent) => {
          const percentage = Math.ceil(
            (progressEvent.loadedBytes / fileSize) * 100
          );
          setProgress(percentage);
        },
      };
      blobClient.uploadData(newFile, options).then(async (response) => {
        setIsUploading(false);
        await blobClient.setMetadata({
          fileName,
          fileExtension,
        });
        await axios.post('/api/try/uploadComplete', {
          entryKey,
        });

        axios
          .post<{
            url: {
              audio: string;
              txt?: string;
              srt: string;
            };
            subtitles: Subtitle[];
            transcript: string;
          }>('/api/try/transcribe', {
            entryKey,
          })
          .then((response) => {
            console.log(response);
            setData(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  } catch (err) {
    console.log(err);
  }
};
