import type { Document } from '@contentful/rich-text-types';

interface RawPageFields {
  title: string;
  slug: string;
  body: Document;
  parentPage?: {
    sys: {
      id: string;
    };
  };
}

interface RawAnnouncementFields {
  message: string;
  visible: boolean;
}

interface RawMissionFields {
  number: string;
  title: string;
  summary: string;
  date: string;
}

interface RawEntriesResponse<F> {
  items: Array<{
    sys: {
      id: string;
    };
    fields: F;
  }>;
  includes?: {
    Asset?: Array<{
      sys: {
        id: string;
        createdAt: string; // ISO8601 timestamp
        updatedAt: string; // ISO8601 timestamp
      };
      fields: {
        title?: string;
        file: {
          contentType: string;
          fileName: string;
          url: string; // Need to prepend protocol
          details?: {
            image?: {
              width: number;
              height: number;
            };
          };
        };
      };
    }>;
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  body: Document;
  parentPageId: string | null;
  images: Image[];
}

export interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
  title: string;
}

export interface Announcement {
  id: string;
  message: string;
  visible: boolean;
}

export interface Mission {
  id: string;
  missionNumber: string;
  title: string;
  date: string;
  summary: string;
}

// A path to a page.
//
// For example, `['missions', '2020']` is the path for the page appearing at
// `/missions/2020`.
export type Path = string[];

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

// Get the id and path for every page on the site.
export const getPaths = async (): Promise<Path[]> => {
  const url = getContentfulUrl({
    endpoint: 'entries',
    params: {
      content_type: 'page',
      select: 'sys.id,fields.slug,fields.parentPage',
    },
  });

  const response = await fetch(url);
  const responseBody: RawEntriesResponse<RawPageFields> = await response.json();

  const paths: Path[] = responseBody.items.map((page) => {
    const path = [page.fields.slug];

    let parentPage = responseBody.items.find(
      (otherPage) => otherPage.sys.id === page.fields.parentPage?.sys.id,
    );

    while (parentPage) {
      path.unshift(parentPage.fields.slug);
      parentPage = responseBody.items.find(
        (otherPage) =>
          otherPage.sys.id === parentPage?.fields.parentPage?.sys.id,
      );
    }

    return path;
  });

  return paths;
};

// Get all the content for a single page, including any referenced assets.
export const getPage = async (
  slug: string,
  preview: boolean,
): Promise<null | Page> => {
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
  const responseBody: RawEntriesResponse<RawPageFields> = await response.json();

  if (responseBody.items.length === 0) {
    return null;
  }

  const images =
    responseBody.includes?.Asset?.filter(
      (asset) => asset.fields.file?.details?.image,
    ).map((asset) => {
      return {
        id: asset.sys.id,
        url: `https:${asset.fields.file.url}`,
        width: asset.fields.file.details?.image?.width ?? 0,
        height: asset.fields.file.details?.image?.height ?? 0,
        title: asset.fields.title ?? '',
      };
    }) ?? [];

  const rawPage = responseBody.items[0];

  const page: Page = {
    id: rawPage.sys.id,
    title: rawPage.fields.title,
    slug: rawPage.fields.slug,
    body: rawPage.fields.body,
    parentPageId: rawPage.fields.parentPage?.sys.id ?? null,
    images,
  };

  return page;
};

export const getPhotos = async (
  entryId: string,
  preview: boolean = false,
): Promise<Image[]> => {
  const url = getContentfulUrl({
    endpoint: 'entries',
    params: {
      'sys.id': entryId,
    },
    preview,
  });

  const response = await fetch(url);
  const responseBody: RawEntriesResponse<{}> = await response.json();

  const result: Image[] =
    responseBody.includes?.Asset?.map((asset) => ({
      id: asset.sys.id,
      title: asset.fields.title ?? '',
      url: `https:${asset.fields.file.url}`,
      width: asset.fields.file?.details?.image?.width ?? 0,
      height: asset.fields.file?.details?.image?.height ?? 0,
    })) ?? [];

  return result;
};

export const getAnnouncement = async (
  announcementId: string,
): Promise<null | Announcement> => {
  const url = getContentfulUrl({
    endpoint: 'entries',
    params: { 'sys.id': announcementId },
  });

  const response = await fetch(url);
  const responseBody: RawEntriesResponse<RawAnnouncementFields> = await response.json();

  if (!responseBody.items[0]) {
    return null;
  }

  const result: Announcement = {
    id: responseBody.items[0].sys.id,
    message: responseBody.items[0].fields.message,
    visible: responseBody.items[0].fields.visible,
  };

  return result;
};

export const getMissions = async (year: number): Promise<Mission[]> => {
  const url = getContentfulUrl({
    endpoint: 'entries',
    params: {
      content_type: 'mission',
      'fields.date[gte]': `${year}-01-01T00:00:00Z`,
      'fields.date[lt]': `${year + 1}-01-01T00:00:00Z`,
    },
  });

  const response = await fetch(url);
  const responseBody: RawEntriesResponse<RawMissionFields> = await response.json();

  const result: Mission[] = responseBody.items.map((item) => ({
    id: item.sys.id,
    missionNumber: item.fields.number,
    title: item.fields.title,
    summary: item.fields.summary,
    date: item.fields.date,
  }));

  result.sort((a, b) => a.missionNumber.localeCompare(b.missionNumber));

  return result;
};
