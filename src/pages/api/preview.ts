import type { NextApiRequest, NextApiResponse } from 'next';

import { getPage } from '../../lib/api';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { secret, slug } = req.query;

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const page = await getPage(slug as string, true);

  if (!page) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  res.setPreviewData({});

  const redirectUrl = `/${page.slug}`;

  res.write(
    `<!DOCTYPE html>
     <html>
       <head>
         <meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
         <script>window.location.href = '${redirectUrl}'</script>
       </head>
     </html>`,
  );

  res.end();
};
