import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { Node, Document, BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { Layout } from '../components/Layout';

interface PageEntry {
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
}

interface Asset {
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
}

interface PageProps {
  pageEntry: PageEntry;
  assets: Asset[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_DELIVERY_TOKEN}&content_type=page&select=fields.slug`,
  );

  const responseBody = await response.json();

  const paths = responseBody.items.map(({ fields: { slug } }: any) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_DELIVERY_TOKEN}&content_type=page&fields.slug=${params?.slug}&limit=1`,
  );

  const responseBody = await response.json();

  if (responseBody.items.length === 0) {
    return { notFound: true };
  }

  const props: PageProps = {
    pageEntry: responseBody.items[0],
    assets: responseBody.includes.Asset,
  };

  return { props };
};

const ImageNode = ({ node, assets }: { node: Node; assets: Asset[] }) => {
  const asset = assets.find(
    (asset) => asset.sys?.id === node.data?.target?.sys?.id,
  );

  if (!asset) {
    return null;
  }

  const src = `http:${asset.fields.file?.url}`;
  const alt = asset.fields.title ?? '';
  const { width, height } = asset.fields.file?.details.image ?? {
    width: 0,
    height: 0,
  };

  return (
    <div className='relative w-full'>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};

const Page = ({ pageEntry, assets }: PageProps) => {
  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => (
        <ImageNode node={node} assets={assets} />
      ),
    },
  };

  return (
    <Layout>
      <div className='prose'>
        {documentToReactComponents(pageEntry.fields.body, renderOptions)}
      </div>
    </Layout>
  );
};

export default Page;
