import type { NextApiRequest, NextApiResponse } from 'next';

import { getPageBySlug } from '../../lib/api';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { secret, slug } = req.query;

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const pageResult = await getPageBySlug(slug as string, true);

  if (!pageResult) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  res.setPreviewData({});

  const validSlug = pageResult.pageEntry.fields.slug;

  res.writeHead(307, { Location: `/${validSlug}` });
  res.end();
};
