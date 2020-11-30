import { FunctionComponent } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import { getPhotos, getAnnouncement, Announcement, Image } from '../lib/api';
import { Layout } from '../components/Layout';
import { ImageGallery } from '../components/ImageGallery';
import { AlertIcon } from '../components/AlertIcon';

interface HomeProps {
  announcement: null | Announcement;
  galleryImages: Image[];
}

const GALLERY_ENTRY_ID = '4C0dAB5QuL4QdGbqdJZ1pl';
const ANNOUNCEMENT_ID = '9ciTmDG0hXu5RAeiFGH4A';

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview,
}) => {
  const galleryImages = await getPhotos(GALLERY_ENTRY_ID, preview);
  const announcement = await getAnnouncement(ANNOUNCEMENT_ID);

  return {
    props: { galleryImages, announcement },
    revalidate: Number(process.env.REVALIDATE_TIME_S),
  };
};

const BigLink: FunctionComponent<{ href: string }> = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className='border-b border-gray-50 border-dashed hover:text-blue-500 hover:border-blue-500 hover:border-solid hover:border'>
        {children}
      </a>
    </Link>
  );
};

const Home: FunctionComponent<HomeProps> = ({
  announcement,
  galleryImages,
}) => {
  return (
    <div className='min-w-full min-h-full bg-gradient-to-b from-gray-900 bg-gray-800 text-gray-100'>
      <Layout backgroundColor={null}>
        <div className='max-w-screen-xl mx-auto'>
          <div className='mx-8 sm:mx-16 my-8 sm:my-16 space-y-8 flex flex-col'>
            <h1 className='text-5xl font-medium font-serif'>
              Any time, anywhere, any weather.
            </h1>
            <h2 className='text-xl mb-8 max-w-lg leading-relaxed'>
              Learn about Marin SAR by reading{' '}
              <BigLink href='/what-we-do'>what we do</BigLink> or browsing{' '}
              <BigLink href='/missions'>past missions</BigLink>. You may be
              looking to <BigLink href='/apply'>apply</BigLink>.
            </h2>
          </div>
          {announcement?.visible && (
            <div className='flex items-stretch justify-start rounded bg-gray-700 shadow-md mx-8 sm:mx-16 sm:mb-8'>
              <div className='bg-gray-800 rounded-l flex items-center p-4'>
                <AlertIcon className='flex-none' />
              </div>
              <aside className='p-4'>
                Our next application deadline is delayed to spring or fall 2021
                due to the COVID-19 pandemic.
              </aside>
            </div>
          )}
        </div>
        <div className='max-w-screen-2xl mx-auto w-full sm:px-16 py-16'>
          <ImageGallery images={galleryImages} />
        </div>
      </Layout>
    </div>
  );
};

export default Home;
