import { observable, computed, IObservableArray, action } from 'mobx';
import { ChangeEvent } from 'react';
import { components, IFormComponent } from '../components/builder/elements';

const root = document.documentElement;

// todo -
// show all keyframes as ticks on slider
// make types better
// add repeat option
// add animation mode (ease, etc)
// make add keyframe relative to selected keyframe
// separate out x and y from translate\
// add icons for expo presentation
// fix full screen size to be smart about scale value based on vh
// user-select: none on iframe?
// improve dragging, e.g. distance from center to cursor
// pause at current point, don't reset
// click on keyframe sets timeline to that time
// adding keframe should subtract delay
// new keyframe should preserve scale from previous keyframe
// add auto scale in key frame ~ 100ms
// input for offset time
// when re-ordering remain with the selected component

export interface IKeyframe {
  id: number;
  time: number;
  translate: string;
  rotate: string;
  scale: number;
  opacity: number;
}

// interface IFormElement extends  {

// }

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
  public form: IObservableArray<IFormComponent> = observable.array([]);
  @observable
  public formTitle: string = '';
  @observable
  public animationState: string = 'paused';
  @observable
  public selectedIndex: number | null = null;
  @observable
  public selectedKeyframe: number | null = null;
  @observable
  public offsetSeconds: number = 0;
  @observable
  public resetting = false;
  @observable
  public containerProperties = { containerScale: 0.6, height: '720px', width: '1280px' };

  private defaultKeyframe = (): IKeyframe => ({
    id: Math.random(),
    time: Number(this.offsetSeconds.toFixed(1)),
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
    const number = Number(value.toFixed(1));
    root.style.setProperty('--offset', -1 * number + 's');
    this.offsetSeconds = number;
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
    const getX = Math.floor(x / this.containerProperties.containerScale);
    const getY = Math.floor(y / this.containerProperties.containerScale);

    if (index) {
      this.form.splice(index, 0, newComponent);
    } else {
      this.form.push({
        ...newComponent,
        properties: {
          ...newComponent.properties,
          delay: this.offsetSeconds,
          keyframes: observable.array([{ ...this.defaultKeyframe(), time: 0, translate: `${getX}px,${getY}px` }])
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
  public selectKeyframe = (index: number) => {
    if (!this.currentComponent) return;
    this.selectedKeyframe = index;
    this.offsetSeconds =
      this.currentComponent.properties.delay + this.currentComponent.properties.keyframes[index].time;
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
    const getX = Math.floor(x / this.containerProperties.containerScale);
    const getY = Math.floor(y / this.containerProperties.containerScale);

    if (currentTime < startTime) {
      const diff = startTime - currentTime;
      component.properties.keyframes = observable.array(
        keyframes.map((keyframe: IKeyframe) => ({
          ...keyframe,
          time: keyframe.time + diff
        }))
      );
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
        this.sortKeyframes(componentIndex, this.form[componentIndex].properties[fieldType][propertyIndex].id);
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
  public sortKeyframes = (index: number, keyframeId?: number) => {
    const sorted = this.form[index].properties.keyframes
      .slice()
      .sort((a: IKeyframe, b: IKeyframe) => Number(a.time) - Number(b.time));
    this.form[index].properties.keyframes.replace(sorted);
    this.setDuration(index);
    if (keyframeId) {
      const newIndex = this.form[index].properties.keyframes.findIndex(
        (keyframe: IKeyframe) => keyframe.id === keyframeId
      );
      console.log(keyframeId, newIndex);
    }
  };

  @action
  public setDuration = (index: number) => {
    const { keyframes } = this.form[index].properties;
    this.form[index].properties.duration = keyframes[keyframes.length - 1].time - keyframes[0].time;
  };

  @action
  public addKeyframe = (componentIndex: number) => {
    const { keyframes, delay } = this.form[componentIndex].properties;
    const keyframe = keyframes[keyframes.length - 1];
    keyframes.push({
      ...keyframe,
      id: Math.random(),
      time: Number((this.offsetSeconds - delay).toFixed(1))
    });
    this.selectKeyframe(keyframes.length - 1);
    this.sortKeyframes(componentIndex);
  };

  @action
  public duplicateField = (componentIndex: number, fieldType: string, propertyIndex: number) => {
    const newField = this.form[componentIndex].properties[fieldType][propertyIndex];
    this.form[componentIndex].properties[fieldType].push({ ...newField });
  };
  @action
  public removeField = (componentIndex: number, fieldType: string, propertyIndex: number) => {
    this.selectKeyframe(Math.max(0, propertyIndex - 1));
    const { keyframes } = this.form[componentIndex].properties;
    keyframes.replace(keyframes.filter((x, i) => i !== propertyIndex));
  };
  @action
  public removeComponent = (index: number) => {
    this.form.splice(index, 1);
  };
}

export default FormBuilderStore;
