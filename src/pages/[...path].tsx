import { GetStaticPaths, GetStaticProps } from 'next';
import { FunctionComponent } from 'react';

import { Layout } from '../components/Layout';
import { PayPalWidget } from '../components/PayPalWidget';
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

const SidebarLink: FunctionComponent<{ href: string; title: string }> = ({
  children,
  href,
  title,
}) => {
  return (
    <a
      className='border-dotted border-b border-black hover:text-blue-600 hover:border-blue-600'
      href={href}
      title={title}
    >
      {children}
    </a>
  );
};

const Page: FunctionComponent<PageProps> = ({ pageEntry, assets, preview }) => {
  return (
    <Layout title={pageEntry.fields.title} preview={preview}>
      <div className='max-w-screen-xl mx-auto flex justify-start items-stretch'>
        <div className='m-8 sm:m-16 flex-grow'>
          <article className='prose'>
            <h1>{pageEntry.fields.title}</h1>
            <RichTextDocument
              document={pageEntry.fields.body}
              assets={assets}
            />
          </article>
        </div>
        <div className='hidden sm:block md:px-16 bg-gray-100 flex-grow px-8 py-16'>
          <h2 className='text-gray-600 text-sm uppercase font-bold mb-4'>
            Connect
          </h2>
          <p className='leading-6'>
            MarinSAR is on{' '}
            <SidebarLink
              href='https://www.facebook.com/marinsar'
              title='Marin SAR on Facebook'
            >
              Facebook
            </SidebarLink>{' '}
            and{' '}
            <SidebarLink
              href='https://twitter.com/MarinSAR'
              title='Marin SAR on Twitter'
            >
              Twitter
            </SidebarLink>
            .
          </p>
          <h2 className='text-gray-600 text-sm uppercase font-bold mt-12 mb-4'>
            Donate
          </h2>
          <PayPalWidget />
        </div>
      </div>
    </Layout>
  );
};

export default Page;
