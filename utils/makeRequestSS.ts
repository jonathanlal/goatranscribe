import { getAccessToken } from '@auth0/nextjs-auth0';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

function isNextApiRequest(req: any): req is NextApiRequest {
  return 'body' in req;
}

export const makeRequestSS = async ({
  req,
  res,
  endpoint,
  params,
  method = 'POST',
}: {
  req:
    | NextApiRequest
    | (IncomingMessage & {
        cookies: Partial<{
          [key: string]: string;
        }>;
      });
  res: NextApiResponse | ServerResponse<IncomingMessage>;
  endpoint: string;
  params?: any;
  method?: string;
}): Promise<{
  data?: any;
  error?: {
    status: number;
    message: string;
  };
}> => {
  const { accessToken } = await getAccessToken(req, res);
  const requestHeaders = new Headers();

  // Set the Authorization header with the access token
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  requestHeaders.set('Content-Type', 'application/json');

  const response = await fetch(`${process.env.GOAT_API}${endpoint}`, {
    headers: requestHeaders,
    method: method, // Use the original request method
    body:
      method !== 'GET'
        ? JSON.stringify(isNextApiRequest(req) ? req.body : params)
        : undefined, // Pass the request body if it's not a GET request
  });

  if (response.status === 200) {
    return {
      data: await response.json(),
    };
  } else {
    return {
      error: {
        status: response.status,
        message: response.statusText,
      },
    };
  }
};
