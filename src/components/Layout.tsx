import type { FunctionComponent } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { Nav } from './Nav';

type LayoutProps = {
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
    <>
      <Head>
        <title>{title ? `${title} | Marin SAR` : 'Marin SAR'}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {preview && (
        <div className='h-10 bg-pink-600 text-gray-100 flex items-center justify-between px-4'>
          <div className='uppercase font-bold'>
            Previewing unpublished content
          </div>
          <Link href='/api/exit_preview'>
            <a className='text-sm border-b border-dashed hover:border-solid hover:text-white'>
              Exit preview
            </a>
          </Link>
        </div>
      )}
      <header className={`${textColor} ${backgroundColor ?? ''} `}>
        <div className='max-w-screen-xl mx-auto flex flex-col text-center items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-8 py-8 px-8 sm:px-16 '>
          <Link href='/'>
            <a className=''>
              Marin&nbsp;County&nbsp;Sheriff's&nbsp;Office
              Search&nbsp;&&nbsp;Rescue
            </a>
          </Link>
          <Nav />
        </div>
      </header>
      {children}
      <footer className={`p-8 sm:p-16 ${backgroundColor ?? ''} ${textColor}`}>
        <div className='max-w-screen-xl mx-auto'>
          <div className='flex flex-col justify-center space-y-8 md:flex-row md:justify-between md:items-center md:space-x-4 md:space-y-0'>
            <div className='flex items-center justify-center space-x-4'>
              <img
                src='/mcso_logo.svg'
                title="Marin County Sheriff's Office logo"
                className='w-24 h-24'
              />
              <img
                src='/mra_logo.png'
                title="Marin County Sheriff's Office logo"
                className='w-24 h-24'
              />
              <img
                src='/msar_logo.png'
                title="Marin County Sheriff's Office logo"
                className='w-24 h-24'
              />
            </div>
            <address className='text-center md:text-right text-sm'>
              Marin County Sheriff's Department Search and Rescue Team <br />
              1600 Los Gamos Dr. Suite 200 <br />
              San Rafael, CA 94903 <br />
            </address>
          </div>
          <div className='text-sm text-center my-8 text-gray-600 max-w-prose mx-auto'>
            © 2020 Marin County Search and Rescue. Marin County Search and
            Rescue is a division of the Marin County Sheriff's Office, and is a
            registered 501(c)(3) non-profit organization.
          </div>
        </div>
      </footer>
    </>
  );
};
