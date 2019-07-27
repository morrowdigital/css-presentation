import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Nav from './components/Nav';
import { Suspense } from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import mobxStore from './mobx';
import Home from './screens/Home';

interface IExtra {
  custom: {
    contentPadding: number;
    minimal: boolean;
  };
}
const extra = {
  custom: {
    contentPadding: 0,
    minimal: true
  }
};
export type ICustomTheme = Theme & IExtra;

const minimal: Theme = createMuiTheme({
  ...extra,
  typography: {
    useNextVariants: true,
    fontFamily: 'Quicksand',
    fontSize: 16
  },
  palette: {
    type: 'dark',
    background: { default: '#424242' },
    // background: { default: '#fff' },
    primary: { main: '#4caf50' }
  },
  overrides: {
    MuiAppBar: {
      colorDefault: {
        backgroundColor: '#424242'
        // backgroundColor: 'white'
      },
      root: {
        '&:after': {
          content: `''`,
          position: 'absolute',
          zIndex: -1,
          width: '100%',
          height: '100%',
          opacity: 0,
          boxShadow:
            '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
          transition: 'opacity 0.3s ease-in-out'
        },
        '&.scrolled:after': {
          opacity: 1
        },
        boxShadow: 'none'
      }
    },
    MuiInput: {
      root: {
        '&:read-only': { borderBottomColor: 'transparent' }
      }
    }
  }
});

export default () => (
  <MobxProvider {...mobxStore}>
    <ThemeProvider theme={minimal}>
      <CssBaseline />
      <Nav routeTitle="home">
        <Suspense fallback={<div>loading</div>}>
          <Home />
        </Suspense>
      </Nav>
    </ThemeProvider>
  </MobxProvider>
);
