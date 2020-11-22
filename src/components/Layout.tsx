import type { FunctionComponent } from 'react';
import Link from 'next/link';

type LayoutProps = {
  title?: string;
  preview?: boolean;
};

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  title,
  preview = false,
}) => {
  return (
    <>
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
      <div className='container mx-auto'>
        {title && <h1>{title}</h1>}
        {children}
      </div>
    </>
  );
};
