import createRouter, { Plugin, PluginFactory, Router, State } from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { IRoutes } from './routeDefinitions';
import RoutesStore from '../mobx/routes';
import { runInAction } from 'mobx';

function makeMobxRouterPlugin(routes: IRoutes, store: RoutesStore) {
  function mobxRouterPlugin(): Plugin {
    return {
      onTransitionStart(nextState: State, prevState?: State) {
        store.route = {
          params: nextState.params,
          name: nextState.name
        };
      },
      onTransitionSuccess(nextState?: State, prevState?: State) {
        const prevParams = (prevState || ({} as any)).params || {};
        const nextParams = nextState ? nextState.params || {} : {};
        const prevRoute = routes[(prevState || ({} as any)).name];
        const nextRoute = nextState ? routes[nextState.name] : null;

        if (prevRoute != null && prevRoute.deactivate != null) {
          prevRoute.deactivate(store, prevParams, nextState);
        }

        runInAction(() => {
          if (nextRoute && nextRoute.activate) {
            nextRoute.activate(store, nextParams, prevState || ({} as any));
          }
        });
      }
    };
  }
  return (mobxRouterPlugin as any) as PluginFactory;
}

export function makeMobxRouter(routes: IRoutes, store: RoutesStore): Router {
  const router = createRouter(Object.values(routes), { queryParamsMode: 'loose' });
  router.usePlugin(browserPlugin(), makeMobxRouterPlugin(routes, store));
  return router;
}
