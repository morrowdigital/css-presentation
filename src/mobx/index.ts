import Routes from './routes';
import FormBuilderStore from './formBuilderStore';
export { default as Routes } from './routes';

export class Root {
  public routesStore = new Routes();
  public formBuilderStore = new FormBuilderStore();
  constructor() {
    Object.keys(this).forEach(storeName => (this[storeName] as any).init && this[storeName].init(this));
  }
}

const stores = new Root();

export default stores;
