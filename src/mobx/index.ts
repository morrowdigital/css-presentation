import FormBuilderStore from './formBuilderStore';

export class Root {
  public formBuilderStore = new FormBuilderStore();
  constructor() {
    Object.keys(this).forEach(storeName => this[storeName].init && this[storeName].init(this));
  }
}

const stores = new Root();

export default stores;
