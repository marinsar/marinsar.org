import type { NextApiRequest, NextApiResponse } from 'next';
import url from 'url';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const referrer = req.headers.referer;

  let redirectUrl = '/';

  if (referrer && typeof referrer === 'string') {
    redirectUrl = new url.URL(referrer).pathname;
  }

  res.clearPreviewData();
  res.writeHead(307, { Location: redirectUrl });
  res.end();
};
