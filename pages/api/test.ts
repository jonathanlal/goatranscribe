import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function (req, res) {
  const { query } = req;

  const endpoint = query?.endpoint;
  console.log(query);
  const { accessToken } = await getAccessToken(req, res);
  const response = await fetch(`http://127.0.0.1:3010/api/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
  });
  if (response.status === 200) {
    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(response.status).json({ error: response.statusText });
  }
});
