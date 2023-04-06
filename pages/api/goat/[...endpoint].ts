import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { endpoint } = req.query;

  const { accessToken } = await getAccessToken(req, res);
  const requestHeaders = new Headers();
  // Object.entries(req.headers).forEach(([key, value]) => {
  //   if (typeof value === 'string') {
  //     requestHeaders.set(key, value);
  //   }
  // });

  // Set the Authorization header with the access token
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  requestHeaders.set('Content-Type', 'application/json');

  // console.log('api URL: ', `${process.env.GOAT_API}${endpoint}`);
  const response = await fetch(`${process.env.GOAT_API}${endpoint}`, {
    headers: requestHeaders,
    method: req.method, // Use the original request method
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined, // Pass the request body if it's not a GET request
  });

  if (response.status === 200) {
    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(response.status).json({ error: response.statusText });
  }
});
