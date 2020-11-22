import type { FunctionComponent } from 'react';

type LayoutProps = {
  preview?: boolean;
};

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  preview = false,
}) => {
  return (
    <>
      {preview && (
        <div className='h-10 bg-pink-600 uppercase font-black text-gray-50 flex items-center justify-center'>
          Preview mode
        </div>
      )}
      <div className='container mx-auto'>{children}</div>
    </>
  );
};
