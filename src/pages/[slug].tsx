import { GetStaticPaths, GetStaticProps } from 'next';

import { Layout } from '../components/Layout';
import { RichTextDocument } from '../components/RichTextDocument';
import { getPageSlugs, getPageBySlug, PageEntry, Asset } from '../lib/api';

interface PageProps {
  pageEntry: PageEntry;
  assets: Asset[];
  preview: boolean;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPageSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const slug = params?.slug as string;
  const maybePage = await getPageBySlug(slug, preview);

  if (!maybePage) {
    return { notFound: true };
  }

  return {
    props: {
      preview,
      ...maybePage,
    },
  };
};

const Page = ({ pageEntry, assets, preview }: PageProps) => {
  return (
    <Layout preview={preview} title={pageEntry.fields.title}>
      <RichTextDocument document={pageEntry.fields.body} assets={assets} />
    </Layout>
  );
};

export default Page;
