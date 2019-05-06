import { observable, computed, IObservableArray, action } from 'mobx';
import { ChangeEvent } from 'react';
import { components } from '../components/builder/elements';

const root = document.documentElement;

// todo - 
// interpolate value for in between begin/end + before beginning
// show all keyframes as ticks on slider
// make types better
// add opacity
// add repeat option
// add animation mode (ease, etc) 

class FormBuilderStore {
  constructor() {
    root.style.setProperty('--offset', '0s');
  }

  @observable
  public form: IObservableArray<any> = observable.array([]);
  @observable
  public formTitle: string = '';

  @observable
  public selectedIndex: number | null = null;

  @observable
  public offsetSeconds: number = -0.1;

  @computed
  public get currentComponent() {
    return (
      this.selectedIndex !== null &&
      this.form.length &&
      this.selectedIndex < this.form.length &&
      this.form[this.selectedIndex]
    );
  }

  @action
  public setOffset = (any: any, value: number) => {
    root.style.setProperty('--offset', -1 * value + 's');
    this.offsetSeconds = value;
  };

  @action
  public setFormTitle = (event: ChangeEvent<HTMLInputElement>) => (this.formTitle = event.target.value);
  @action
  public addComponentToSurvey = (componentType: string, index: number, x: number, y: number) => {
    const newComponent = components[componentType];
    if (index) {
      this.form.splice(index, 0, newComponent);
    } else {
      this.form.push({
        ...newComponent,
        properties: {
          ...newComponent.properties,
          delay: this.offsetSeconds -0.1,
          keyframes: [{ time: 0, translate: `${x}px,${y}px`, scale: 1, rotate: '0deg' }]
        }
      });
    }
  };
  @action
  public selectCurrentComponent = (index: number) => {
    this.selectedIndex = index;
  };
  @action
  public clearAll = (index: number) => {
    this.form = observable.array([]);
    this.formTitle = '';
  };
  @action
  public moveComponentInSurvey = (oldIndex: number, newIndex: number, x: number, y: number) => {
    const component = this.form[oldIndex];
    const { delay, keyframes } = component.properties;
    const startTime = delay;
    const currentTime = this.offsetSeconds;
    const times: number[] = keyframes.map(({ time }: { time: number }) => time);
    const fullTime = Math.max(times.sort((a, b) => Number(b) - Number(a))[0], currentTime);
    if (currentTime < startTime) {
      const diff = startTime - currentTime;
      // increase each object key by diff
      // set 0 to be new position
      component.properties.duration = fullTime - currentTime;
      component.delay = currentTime;
    } else {
      const newTime = currentTime - startTime;
      const existingIndex = keyframes.findIndex(({ time }: { time: number }) => time === newTime);
      existingIndex > -1
        ? (keyframes[existingIndex].translate = `${x}px,${y}px`)
        : keyframes.push({
            time: newTime,
            translate: `${x}px,${y}px`,
            scale: 1,
            rotate: '0deg'
          });
      console.log(fullTime - startTime);
      component.properties.duration = fullTime - startTime;
    }
  };
  @action
  public editComponentProperty = (
    componentIndex: number,
    id: string,
    value: string,
    fieldType: string,
    propertyIndex: number
  ) => {
    if (fieldType) {
      this.form[componentIndex].properties[fieldType][propertyIndex][id] = value;
    } else {
      this.form[componentIndex].properties[id] = value;
    }
  };
  @action
  public duplicateField = (componentIndex: number, fieldType: string, propertyIndex: number) => {
    const newField = this.form[componentIndex].properties[fieldType][propertyIndex];
    this.form[componentIndex].properties[fieldType].push({ ...newField });
  };
  @action
  public removeField = (componentIndex: number, fieldType: string, propertyIndex: number) => {
    this.form[componentIndex].properties[fieldType].splice(propertyIndex, 1);
  };
  @action
  public removeComponent = (index: number) => {
    this.form.splice(index, 1);
  };
}

export default FormBuilderStore;
