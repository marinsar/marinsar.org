import { FunctionComponent } from 'react';

import { PayPalWidget } from '../components/PayPalWidget';

const SidebarLink: FunctionComponent<{ href: string; title: string }> = ({
  children,
  href,
  title,
}) => {
  return (
    <a
      className='border-solid border-b border-gray-900 font-medium hover:text-blue-600 hover:border-blue-600'
      href={href}
      title={title}
    >
      {children}
    </a>
  );
};

export const PageLayout: FunctionComponent = ({ children }) => {
  return (
    <div className='max-w-screen-xl mx-auto flex justify-start items-stretch h-full'>
      <div className='m-8 sm:m-16 flex-grow'>
        <article className='prose'>{children}</article>
      </div>
      <div className='hidden sm:block md:px-16 bg-gray-100 px-8 py-20'>
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
  );
};
