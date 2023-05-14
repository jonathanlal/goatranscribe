import { getAccessToken } from '@auth0/nextjs-auth0';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

function isNextApiRequest(req: any): req is NextApiRequest {
  return 'body' in req;
}
export type ApiResponse = {
  data?: any;
  status: number;
  error?: {
    status: number;
    message: string;
  };
};

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
}): Promise<ApiResponse> => {
  const { accessToken } = await getAccessToken(req, res, {
    refresh: true, //auto refresh the token if it's expired
    scopes: ['offline_access'], //needed for auto refresh
  });
  const requestHeaders = new Headers();

  // Set the Authorization header with the access token
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  requestHeaders.set('Content-Type', 'application/json');

  console.log('params', params);

  // console.log('isNextApiRequest(req)', req.body);
  const response = await fetch(`${process.env.GOAT_API}${endpoint}`, {
    headers: requestHeaders,
    method: method, // Use the original request method
    body:
      method === 'POST'
        ? JSON.stringify(isNextApiRequest(req) ? req.body || params : params)
        : JSON.stringify(params), // Pass the request body if it's not a GET request
  });

  const status = response.status;

  if (status === 200 || status === 202) {
    return {
      data: await response.json(),
      status: status,
    };
  } else {
    return {
      error: {
        status: response.status,
        message: response.statusText,
      },
      status: status,
    };
  }
};
