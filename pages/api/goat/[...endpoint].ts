import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { makeRequestSS } from 'utils/makeRequestSS';

export default withApiAuthRequired(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { endpoint } = req.query;

  const { data, error } = await makeRequestSS({
    req,
    res,
    endpoint: endpoint as string,
  });

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(error.status).json({ error: error.message });
  }
});
