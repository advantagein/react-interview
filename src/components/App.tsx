import { ChakraProvider, Heading } from '@chakra-ui/react';

import Spreadsheet from './Spreadsheet';

const App: React.FC = () => {
  return (
    <ChakraProvider resetCSS>
      <Heading marginBottom="2rem">Spreadsheet</Heading>
      <Spreadsheet />
    </ChakraProvider>
  );
};

export default App;
