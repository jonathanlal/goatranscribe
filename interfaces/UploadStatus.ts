export type UploadStatusKey = 'upload' | 'transcribe' | 'url' | 'oneMinute';

export type UploadStatusFields = {
  description: string;
  currentStatus: 'loading' | 'success' | 'error';
  timeTaken?: number;
};

export type UploadStatus = Record<UploadStatusKey, UploadStatusFields>;
