import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import { PayPalWidget } from '../components/PayPalWidget';

const SidebarLink: FunctionComponent<{ href: string; title: string }> = ({
  children,
  href,
  title,
}) => {
  return (
    <a
      className='font-medium border-b border-gray-900 border-solid hover:text-blue-600 hover:border-blue-600'
      href={href}
      title={title}
    >
      {children}
    </a>
  );
};

export const PageLayout: FunctionComponent = ({ children }) => {
  const { asPath } = useRouter();

  return (
    <div className='flex items-stretch justify-start h-full mx-auto max-w-screen-xl'>
      <div className='flex-grow m-8 sm:m-16'>
        <article className='prose'>{children}</article>
        {asPath === '/donate' && (
          <div className='flex justify-center mt-8'>
            <PayPalWidget />
          </div>
        )}
      </div>
      <div className='hidden px-8 py-20 bg-gray-100 sm:block md:px-16'>
        <h2 className='mb-4 text-sm font-bold text-gray-600 uppercase'>
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
        <h2 className='mt-12 mb-4 text-sm font-bold text-gray-600 uppercase'>
          Donate
        </h2>
        <PayPalWidget />
      </div>
    </div>
  );
};
