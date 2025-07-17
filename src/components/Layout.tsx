import type { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { Nav } from './Nav';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  preview?: boolean;
  backgroundColor?: 'bg-gray-900' | null;
};

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  title,
  preview = false,
  backgroundColor = 'bg-gray-900',
}) => {
  const textColor = backgroundColor === 'bg-gray-900' ? 'text-gray-100' : '';

  return (
    <div className='flex flex-col h-full'>
      <Head>
        <title>{title ? `${title} | Marin SAR` : 'Marin SAR'}</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
      </Head>
      {preview && (
        <div className='bg-pink-600 text-gray-100 flex items-center justify-between px-4 py-2'>
          <div className='uppercase font-bold'>Previewing draft content</div>
          <Link legacyBehavior href='/api/exit_preview'>
            <a className='text-sm border-b border-dashed hover:border-solid hover:text-white'>
              Exit preview
            </a>
          </Link>
        </div>
      )}
      <header className={`${textColor} ${backgroundColor ?? ''}`}>
        <div className='max-w-screen-xl mx-auto flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-8 py-12 px-8 sm:px-16 '>
          <Link legacyBehavior href='/'>
            <a className='flex items-center text-center sm:text-left'>
              <img
                src='/marin_sar_logo.svg'
                title='Marin County Search and Rescue Logo'
                className='h-44 hidden sm:block shadow-sm sm:mr-4 xl:mr-8'
                role='presentation'
              />
              <div>
                <span className='text-md md:text-xl lg:text-2xl xl:text-3xl'>
                  Marin&nbsp;County&nbsp;Sheriff's&nbsp;Office
                </span>
                <br />
                <span className='text-lg md:text-3xl lg:text-4xl xl:text-5xl'>
                  Search&nbsp;&&nbsp;Rescue
                </span>
              </div>
            </a>
          </Link>
          <Nav />
        </div>
      </header>
      <div className='flex-grow'>{children}</div>
      <footer className={`p-8 sm:p-16 ${backgroundColor ?? ''} ${textColor}`}>
        <div className='max-w-screen-xl mx-auto'>
          <div className='flex flex-col justify-center space-y-8 md:flex-row md:justify-between md:items-center md:space-x-4 md:space-y-0'>
            <address className='text-center md:text-left text-sm'>
              Marin County Sheriff's Department Search and Rescue Team <br />
              1600 Los Gamos Dr. Suite 200 <br />
              San Rafael, CA 94903 <br />
            </address>
            <div className='flex items-center justify-center space-x-4'>
              <img
                src='/mcso_logo.svg'
                title="Marin County Sheriff's Office logo"
                className='w-20 h-20'
              />
              <img
                src='/mra_logo.png'
                title='Mountain Rescue Association logo'
                className='w-20 h-20'
              />
              <img
                src='/marin_sar_mountain_rescue_logo.svg'
                title='Marin County Search and Rescue mountain rescue unit logo'
                className='w-20 h-20'
              />
            </div>
          </div>
          <div className='text-sm text-center mt-24 text-gray-600 max-w-prose mx-auto'>
            © 2020 Marin County Search and Rescue. Marin County Search and
            Rescue is a division of the Marin County Sheriff's Office, and is a
            registered 501(c)(3) non-profit organization.
          </div>
        </div>
      </footer>
    </div>
  );
};