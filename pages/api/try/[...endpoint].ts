import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;

  const requestHeaders = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  try {
    const response = await fetch(`${process.env.TRY_API}${endpoint}`, {
      headers: requestHeaders,
      method: 'POST', // Use the original request method
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined, // Pass the request body if it's not a GET request
    });

    const data = await response.json();

    if (response.status === 200) {
      res.status(200).json({ data });
    } else {
      res.status(response.status).json({
        error: {
          status: response.status,
          message: response.statusText,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: 'Internal Server Error',
      },
    });
  }
}
