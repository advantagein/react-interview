import { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript, extendTheme } from '@chakra-ui/react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* Add Chakra UI color mode script */}
        <ColorModeScript initialColorMode={extendTheme().INITIAL_COLOR_MODE} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
