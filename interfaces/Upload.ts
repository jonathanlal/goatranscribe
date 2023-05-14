export interface Upload {
  entry_id: string;
  creation_date: string;
  file_type: string;
  file_size: number;
  file_name: string;
  file_extension: string;
  file_url: string;
  duration: number;
  cost: number;
  status: 'pending' | 'processing' | 'complete' | 'failed';
}
