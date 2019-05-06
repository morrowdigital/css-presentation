import * as React from 'react';
import { Route, State } from 'router5';
import RouteStore from '../mobx/routes';
import Home from '../screens/Home';

export interface ILinkData {
  name?: string;
  params?: object;
}

export interface IRouteDefinition extends Route {
  title: string;
  component: (next?: object) => any;
  link: (...args: any[]) => ILinkData;
  activate?: (store: RouteStore, current?: object, prev?: State) => void;
  deactivate?: (store: RouteStore, current?: object, next?: State) => void;
  // permittedClaims?: string[];
}

export interface IRoutes {
  [name: string]: IRouteDefinition;
}

export const routes: IRoutes = {
  home: {
    name: 'home',
    title: 'Home',
    path: '/',
    link: () => ({
      name: 'home',
      params: {}
    }),
    component: (props: any) => <Home {...props} />
  }
};
