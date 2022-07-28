
import './App.css';
import {
  ChakraProvider,
  useDisclosure,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Link as RouteLink,
  Switch,

} from "react-router-dom";

import { extendTheme } from "@chakra-ui/react"

import HomePage from './components/HomePage';

import NoPage from './components/NoPage';


function App() {

  const theme = extendTheme({
    colors: {
      brand: {
        100: "#f7fafc",
        // ...
        900: "#1a202c",
      },
    },

    styles: {
      global: () => ({
        body: {


        },
      }),
    },

  });



  return (
    <ChakraProvider theme={theme}>
      <Router basename='/'>
        <Switch>
          <Route exact path="/"><HomePage /></Route>
          <Route path="*"><NoPage /></Route>
        </Switch>
      </Router>
    </ChakraProvider >
  );
}

export default App;
