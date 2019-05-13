import { observable, computed, IObservableArray, action } from 'mobx';
import { ChangeEvent } from 'react';
import { components } from '../components/builder/elements';

const root = document.documentElement;

// todo -
// show all keyframes as ticks on slider
// make types better
// add repeat option
// add animation mode (ease, etc)
// make add keyframe relative to selected keyframe
// separate out x and y from translate\
// add icons for expo presentation
// fix full screen size to be 100%

export interface IKeyframe {
  time: number;
  translate: string;
  rotate: string;
  scale: number;
}

class FormBuilderStore {
  constructor() {
    root.style.setProperty('--offset', '0s');
    const project = localStorage.getItem('project');
    if (project) {
      this.setProject(project);
    }
    window.onbeforeunload = () => {
      localStorage.setItem(
        'project',
        JSON.stringify({ form: this.form, containerProperties: this.containerProperties })
      );
    };
  }

  @observable
  public form: IObservableArray<any> = observable.array([]);
  @observable
  public formTitle: string = '';
  @observable
  public animationState: string = 'paused';
  @observable
  public selectedIndex: number | null = null;
  @observable
  public offsetSeconds: number = 0;
  @observable
  public resetting = false;
  @observable
  public containerProperties = { containerScale: 0.6, height: '720px', width: '1280px' };

  private defaultKeyframe = () => ({
    time: this.offsetSeconds,
    translate: '',
    scale: 1,
    rotate: '0deg',
    opacity: 1
  });

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
  public play = () => {
    // this.setOffset(null, 0);
    this.animationState = 'running';
  };

  @action
  public pause = () => {
    this.resetting = true;
    setTimeout(() => (this.resetting = false), 0);
    this.animationState = 'paused';
  };

  @action
  public setFormTitle = (event: ChangeEvent<HTMLInputElement>) => (this.formTitle = event.target.value);
  @action
  public setProject = (project: string) => {
    const parsed = JSON.parse(project);
    this.form = parsed.form;
    this.containerProperties = parsed.containerProperties;
  };

  @action
  public addComponentToSurvey = (componentType: string, index: number, x: number, y: number) => {
    const newComponent = components[componentType];
    const getX = x / this.containerProperties.containerScale;
    const getY = y / this.containerProperties.containerScale;

    if (index) {
      this.form.splice(index, 0, newComponent);
    } else {
      this.form.push({
        ...newComponent,
        properties: {
          ...newComponent.properties,
          delay: this.offsetSeconds,
          keyframes: [{ ...this.defaultKeyframe(), time: 0, translate: `${getX}px,${getY}px` }]
        }
      });
      root.style.setProperty('--offset', -1 * this.offsetSeconds - 0.1 + 's');
    }
  };

  @action
  public selectCurrentComponent = (index: number | null) => {
    this.selectedIndex = index; 
  };

  @action
  public clearAll = () => {
    this.form = observable.array([]);
    this.formTitle = '';
  };

  @action
  public moveComponentInSurvey = (componentIndex: number, newIndex: number, x: number, y: number) => {
    const component = this.form[componentIndex];
    const { delay, keyframes } = component.properties;
    const startTime = delay;
    const currentTime = this.offsetSeconds;
    const getX = x / this.containerProperties.containerScale;
    const getY = y / this.containerProperties.containerScale;

    if (currentTime < startTime) {
      const diff = startTime - currentTime;
      component.properties.keyframes = keyframes.map((keyframe: IKeyframe) => ({
        ...keyframe,
        time: keyframe.time + diff
      }));
      component.properties.keyframes.unshift({
        ...this.defaultKeyframe(),
        time: 0,
        translate: `${getX}px,${getY}px`
      });
      component.properties.delay = currentTime;
      this.sortKeyframes(componentIndex);
    } else {
      const newTime = currentTime - startTime;
      const existingIndex = keyframes.findIndex(({ time }: { time: number }) => time === newTime);
      existingIndex > -1
        ? (keyframes[existingIndex].translate = `${getX}px,${getY}px`)
        : keyframes.push({
            ...this.defaultKeyframe(),
            time: newTime,
            translate: `${getX}px,${getY}px`
          });
      this.sortKeyframes(componentIndex);
    }
  };
  @action
  public editComponentProperty = (
    componentIndex: number,
    id: string,
    value: string | number,
    fieldType: string,
    propertyIndex: number
  ) => {
    if (fieldType) {
      this.form[componentIndex].properties[fieldType][propertyIndex][id] = value;
      if (id === 'time') {
        this.sortKeyframes(componentIndex);
      }
    } else {
      this.form[componentIndex].properties[id] = value;
    }
  };

  @action
  public editContainerProperty = (property: string, value: string | number) => {
    this.containerProperties[property] = value;
  };

  @action
  public sortKeyframes = (index: number) => {
    const sorted = this.form[index].properties.keyframes
      .slice()
      .sort((a: IKeyframe, b: IKeyframe) => Number(a.time) - Number(b.time));
    this.form[index].properties.keyframes.replace(sorted);
    this.setDuration(index);
  };

  @action
  public setDuration = (index: number) => {
    const { keyframes } = this.form[index].properties;
    this.form[index].properties.duration = keyframes[keyframes.length - 1].time - keyframes[0].time;
  };

  @action
  public addKeyframe = (componentIndex: number) => {
    const { keyframes } = this.form[componentIndex].properties;
    const { translate } = keyframes[keyframes.length - 1];
    keyframes.push({
      ...this.defaultKeyframe(),
      translate
    });
    this.sortKeyframes(componentIndex);
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
