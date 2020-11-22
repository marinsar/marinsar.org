import type { Document } from '@contentful/rich-text-types';

export type PageEntry = {
  sys: {
    id: string;
    createdAt: string; // ISO8601 timestamp
    updatedAt: string; // ISO8601 timestamp
  };
  fields: {
    title: string;
    slug: string;
    body: Document;
  };
};

export type Asset = {
  sys: {
    id: string;
    createdAt: string; // ISO8601 timestamp
    updatedAt: string; // ISO8601 timestamp
  };
  fields: {
    title?: string;
    file?: {
      contentType: string;
      fileName: string;
      url: string; // Need to prepend protocol
      details: {
        image?: {
          width: number;
          height: number;
        };
      };
    };
  };
};

const getContentfulUrl = ({
  endpoint,
  params = {},
  preview = false,
}: {
  endpoint: 'entries' | 'assets';
  params?: { [k: string]: string | number };
  preview?: boolean;
}): string => {
  const domain = preview ? 'preview.contentful.com' : 'cdn.contentful.com';
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_TOKEN
    : process.env.CONTENTFUL_DELIVERY_TOKEN;

  const url = `https://${domain}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/${endpoint}?access_token=${token}`;

  const urlWithParams = Object.entries(params).reduce(
    (acc, [k, v]) => `${acc}&${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
    url,
  );

  return urlWithParams;
};

export const getPageSlugs = async (): Promise<string[]> => {
  const url = getContentfulUrl({
    endpoint: 'entries',
    params: { content_type: 'page', select: 'fields.slug' },
  });

  const response = await fetch(url);
  const responseBody = await response.json();

  const slugs = responseBody.items.map(({ fields: { slug } }: any) => slug);

  return slugs;
};

export const getPageBySlug = async (
  slug: string,
  preview: boolean,
): Promise<null | { pageEntry: PageEntry; assets: Asset[] }> => {
  const url = getContentfulUrl({
    endpoint: 'entries',
    params: {
      content_type: 'page',
      'fields.slug': slug,
      limit: 1,
    },
    preview,
  });

  const response = await fetch(url);
  const responseBody = await response.json();

  if (responseBody.items.length === 0) {
    return null;
  }

  const result = {
    pageEntry: responseBody.items[0],
    assets: responseBody.includes?.Asset ?? [],
  };

  return result;
};
