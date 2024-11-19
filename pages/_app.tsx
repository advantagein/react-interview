import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import '../styles.scss';

const RunwayApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default RunwayApp;
