import { Subtitle } from "./Subtitle";

export type TranscribeResponse = {
    url: {
      audio: string;
      txt?: string;
      srt: string;
    };
    subtitles: Subtitle[];
    transcript: string;
  }