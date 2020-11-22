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

const buildEntriesUrl = (
  params: { [k: string]: string | number },
  preview = false,
): string => {
  const baseUrl = `https://${
    preview ? 'preview' : 'cdn'
  }.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${
    process.env.CONTENTFUL_ENVIRONMENT
  }/entries?access_token=${process.env.CONTENTFUL_DELIVERY_TOKEN}`;

  const url = Object.entries(params).reduce(
    (acc, [k, v]) => `${acc}&${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
    baseUrl,
  );

  return url;
};

export const getPageSlugs = async (): Promise<string[]> => {
  const url = buildEntriesUrl({ content_type: 'page', select: 'fields.slug' });
  const response = await fetch(url);
  const responseBody = await response.json();
  const slugs = responseBody.items.map(({ fields: { slug } }: any) => slug);

  return slugs;
};

export const getPageBySlug = async (
  slug: string,
  preview: boolean,
): Promise<null | { pageEntry: PageEntry; assets: Asset[] }> => {
  const url = buildEntriesUrl(
    {
      content_type: 'page',
      'fields.slug': slug,
      limit: 1,
    },
    preview,
  );

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
