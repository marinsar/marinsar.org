import { GetStaticPaths, GetStaticProps } from 'next';
import { FunctionComponent } from 'react';

import { Layout } from '../components/Layout';
import { PageLayout } from '../components/PageLayout';
import { RichTextDocument } from '../components/RichTextDocument';
import { getPaths, getPage, Page as PageType, Path } from '../lib/api';

interface PageProps {
  page: PageType;
  preview: boolean;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPaths();
  const wrappedPaths = paths.map((path) => ({ params: { path } }));

  return { paths: wrappedPaths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  PageProps,
  { path: Path }
> = async ({ params, preview = false }) => {
  const path = params!.path;
  const slug = path[path.length - 1];
  const page = await getPage(slug, preview);

  if (!page) {
    return { notFound: true };
  }

  return {
    props: { preview, page },
    revalidate: Number(process.env.REVALIDATE_TIME_S),
  };
};

const Page: FunctionComponent<PageProps> = ({ page, preview }) => {
  return (
    <Layout title={page.title} preview={preview}>
      <PageLayout>
        <h1>{page.title}</h1>
        <RichTextDocument document={page.body} images={page.images} />
      </PageLayout>
    </Layout>
  );
};

export default Page;
