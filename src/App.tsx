import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider, makeStyles } from '@material-ui/styles';
import { inject, observer } from 'mobx-react';
import Routes from './mobx/routes';
import Nav from './components/Nav';
import { Suspense } from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import mobxStore from './mobx';

const extra = {
  custom: {
    contentPadding: 0,
    minimal: true
  }
};

const minimal: Theme = createMuiTheme({
  ...extra,
  typography: {
    useNextVariants: true
    // fontFamily: 'Quicksand',
    // fontSize: 16
  },
  palette: {
    primary: {
      main: '#000a3a'
    },
    secondary: {
      main: '#1eace1'
    },
    background: { default: '#fff' }
  },
  overrides: {
    MuiAppBar: {
      colorDefault: {
        backgroundColor: 'white'
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

interface InjectedProps {
  routesStore: Routes;
}

@inject('routesStore')
@observer
class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.injected.routesStore.router.start();
  }
  get injected() {
    return this.props as InjectedProps;
  }

  public renderRoute = () => {
    const { routesStore } = this.injected;
    const { route, routes } = routesStore;
    if (route == null || !route.name) {
      return null;
    }
    const routeDefinition = routes[route.name];
    return routeDefinition.component({ route, routesStore });
  };

  public render() {
    const { routesStore } = this.injected;
    const { route, routes } = routesStore;
    const toRender = this.renderRoute();
    return (
      <ThemeProvider theme={minimal}>
        <CssBaseline />
        <Nav routeTitle={route.name ? routes[route.name].title : ''} routesStore={routesStore}>
          {toRender ? (
            <Suspense fallback={<div>loading</div>}>{toRender}</Suspense>
          ) : (
            'You have attempted to navigate to a non existent route'
          )}
        </Nav>
      </ThemeProvider>
    );
  }
}

export default () => (
  <MobxProvider {...mobxStore}>
    <App />
  </MobxProvider>
);
