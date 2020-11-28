import { GetStaticPaths, GetStaticProps } from 'next';
import { FunctionComponent } from 'react';

import { Layout } from '../components/Layout';
import { PageLayout } from '../components/PageLayout';
import { RichTextDocument } from '../components/RichTextDocument';
import { getPages, getPage, PageEntry, Asset } from '../lib/api';

interface PageProps {
  pageEntry: PageEntry;
  assets: Asset[];
  preview: boolean;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getPages();
  const paths = pages.map((page) => ({ params: page }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  PageProps,
  { id: string; path: string[] }
> = async ({ params, preview = false }) => {
  const slug = params!.path[params!.path.length - 1];
  const maybePage = await getPage(slug, preview);

  if (!maybePage) {
    return { notFound: true };
  }

  return {
    props: { preview, ...maybePage },
    revalidate: Number(process.env.REVALIDATE_TIME_S),
  };
};

const Page: FunctionComponent<PageProps> = ({ pageEntry, assets, preview }) => {
  return (
    <Layout title={pageEntry.fields.title} preview={preview}>
      <PageLayout>
        <h1>{pageEntry.fields.title}</h1>
        <RichTextDocument document={pageEntry.fields.body} assets={assets} />
      </PageLayout>
    </Layout>
  );
};

export default Page;
