import { observable } from 'mobx';
import { NavigationOptions } from 'router5';
import { ILinkData, routes } from '../routing/routeDefinitions';
import { makeMobxRouter } from '../routing/mobxRouterMiddleware';

function toJSForce(object: any) {
  return JSON.parse(JSON.stringify(object));
}

export interface IRoute {
  name: string;
  params: any;
}

class Routes {
  public routes = routes;
  public router = makeMobxRouter(this.routes, this);

  @observable
  public route: IRoute = {
    name: '',
    params: {}
  };

  public navigate = (linkData: ILinkData, options?: NavigationOptions, done?: any) => {
    const name = linkData.name || this.route.name;
    const rest = toJSForce(this.route.params);
    if (name === this.route.name && JSON.stringify(rest) === JSON.stringify(linkData.params)) {
      return;
    }
    if (name && routes[name]) {
      const params = linkData.params ? toJSForce(linkData.params) : {};
      const args: [string, object, object, any?] = [name, { ...params }, options || {}, done];
      this.router.navigate(...args);
    }
  };
}

export default Routes;
