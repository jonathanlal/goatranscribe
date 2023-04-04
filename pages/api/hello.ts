import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files, File as FFile } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';
import { Subtitle } from 'interfaces/Subtitle';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseSRT = (content: string): Subtitle[] => {
  const regex = /(\d+)\n([\d:,]+) --> ([\d:,]+)\n([\s\S]*?)(?=\n{2,}|$)/g;
  const subtitles: Subtitle[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    subtitles.push({
      section: parseInt(match[1]),
      startTime: match[2],
      endTime: match[3],
      text: match[4].trim(),
    });
  }

  return subtitles;
};

const loadSRTFile = (filePath: string): Subtitle[] => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return parseSRT(fileContent);
};

const getRelativePublicPath = (absolutePath: string): string => {
  const publicPath = path.join(process.cwd(), 'public');
  return absolutePath.replace(publicPath, '').replace(/\\/g, '/');
};

async function writeFile(filePath: string, data: Buffer | string) {
  try {
    await fs.promises.writeFile(filePath, data);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

const generateNewFileName = (
  originalFilename: string,
  newFileExtension?: string
): string => {
  const fileExtension = path.extname(originalFilename);
  const fileName = path.basename(originalFilename, fileExtension);
  const uniqueId = Date.now();
  return `${fileName}_${uniqueId}${
    newFileExtension ? newFileExtension : fileExtension
  }`;
};

const hello = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    form.parse(req, async (err: Error, fields: Fields, files: Files) => {
      if (err) {
        res.status(400).json({ error: 'Error parsing the form data.' });
        return;
      }

      // Get the uploaded file
      const uploadedFile = files.file as FFile;

      // Create the uploads folder if it doesn't exist
      const uploadsFolderPath = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadsFolderPath)) {
        fs.mkdirSync(uploadsFolderPath);
      }

      const destinationPath = path.join(
        uploadsFolderPath,
        generateNewFileName(uploadedFile.originalFilename)
      );

      try {
        // Read the contents of the file into a Buffer
        const buffer = await fs.promises.readFile(uploadedFile.filepath);

        // Write the buffer to the destinationPath
        const isWritten = await writeFile(destinationPath, buffer);
        if (!isWritten) {
          throw new Error('Error writing uploaded file.');
        }

        const transcript = await openai.createTranscription(
          fs.createReadStream(destinationPath) as any,
          'whisper-1',
          '',
          'srt'
        );

        const transcriptPath = path.join(process.cwd(), 'public/transcripts');
        if (!fs.existsSync(transcriptPath)) {
          fs.mkdirSync(transcriptPath);
        }

        const transcriptdestinationPath = path.join(
          transcriptPath,
          generateNewFileName(uploadedFile.originalFilename, '.srt')
        );

        const isTranscriptWritten = await writeFile(
          transcriptdestinationPath,
          transcript.data.toString()
        );
        if (!isTranscriptWritten) {
          throw new Error('Error writing transcript file.');
        }

        const subtitles = loadSRTFile(transcriptdestinationPath);

        const transcriptJsonPath = path.join(
          transcriptPath,
          generateNewFileName(uploadedFile.originalFilename, '.json')
        );

        const isTranscriptJsonWritten = await writeFile(
          transcriptJsonPath,
          JSON.stringify(subtitles)
        );
        if (!isTranscriptJsonWritten) {
          throw new Error('Error writing transcript file.');
        }

        res.status(200).json({
          message: 'File uploaded and saved.',
          transcript: getRelativePublicPath(transcriptdestinationPath),
          transcriptJson: subtitles,
          audio: getRelativePublicPath(destinationPath),
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during processing.' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default hello;
