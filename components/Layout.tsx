import type { FunctionComponent } from 'react';

export const Layout: FunctionComponent = ({ children }) => {
  return <div className='container mx-auto'>{children}</div>;
};
