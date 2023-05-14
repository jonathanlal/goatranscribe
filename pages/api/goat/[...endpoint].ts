import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { makeRequestSS } from 'utils/makeRequestSS';

export default withApiAuthRequired(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { endpoint } = req.query;

  const { data, error, status } = await makeRequestSS({
    req,
    res,
    params: req.query,
    endpoint: endpoint as string,
  });

  if (data) {
    res.status(status).json(data);
  } else {
    res.status(error.status).json({ error: error.message });
  }
});
