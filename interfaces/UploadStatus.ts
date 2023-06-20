export type UploadStatusKey = 'upload' | 'transcribe' | 'url' | 'oneMinute';

export type UploadStatusFields = {
  description: string;
  currentStatus: 'loading' | 'success' | 'error' | 'progress';
  timeTaken?: number;
  uploadProgress?: number;
  fileName?: string;
  fileSize?: string;
};

export type UploadStatus = Record<UploadStatusKey, UploadStatusFields>;

export type MultipleUploadsStatus = Record<string, UploadStatusFields>;
