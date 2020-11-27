import { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';

import '../index.css';

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
