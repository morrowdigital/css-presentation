import { Text, ITextProps } from './Text';
import { Img, IImgProps } from './Img';
import { Iframe, IIFrameProps } from './Iframe';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fab, fas);
import { BrandIcon, IBrandIconProps } from './BrandIcon';
import { RegularIcon, IRegularIconProps } from './RegularIcon';
import { IKeyframe } from '../../../mobx/formBuilderStore';
import { IObservableArray, observable } from 'mobx';

export interface IFormComponent {
  code: string;
  properties: IFormComponentProperties;
}

export interface IFormComponentCommonProperties {
  delay: number;
  duration: number;
  keyframes: IObservableArray<IKeyframe>;
  zIndex: number;
}

export type IFormComponentProperties =
  | IFormComponentCommonProperties & IIFrameProps
  | IFormComponentCommonProperties & IImgProps
  | IFormComponentCommonProperties & ITextProps
  | IFormComponentCommonProperties & IBrandIconProps
  | IFormComponentCommonProperties & IRegularIconProps;

export interface IFormComponents {
  [name: string]: IFormComponent;
}

export const componentLookup = {
  Text,
  Img,
  BrandIcon,
  RegularIcon,
  Iframe
};

const commonProps = { delay: 0, duration: 0, keyframes: observable.array([]), zIndex: 1 };

export const components: IFormComponents = {
  Text: { code: 'Text', properties: { text: 'Some Text', ...commonProps } },
  Img: { code: 'Img', properties: { src: 'http://placekitten.com/100/100', ...commonProps } },
  Iframe: {
    code: 'Iframe',
    properties: {
      containerWidth: '200px',
      containerHeight: '200px',
      iframeWidth: '800px',
      iframeHeight: '800px',
      padding: '10px',
      iframeScale: 0.25,
      overflow: 'hidden',
      src: 'https://appsapiens.uk/',
      ...commonProps
    }
  },
  BrandIcon: { code: 'BrandIcon', properties: { icon: 'react', color: 'lightblue', size: '5x', ...commonProps } },
  RegularIcon: { code: 'RegularIcon', properties: { icon: 'dizzy', color: 'lightblue', size: '5x', ...commonProps } }
};
