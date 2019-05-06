import { Text } from './Text';
import { Img } from './Img';

export interface IFormComponents {
  [name: string]: {
    code: string;
    properties: object;
  };
}

export const componentLookup = {
  Text,
  Img
};

const commonProps = {delay: 0,  duration: 0, keyframes: {}}

export const components: IFormComponents = {
  Text: { code: 'Text', properties: { text: 'Some Text', ...commonProps } },
  Img: { code: 'Img', properties: { src: 'http://placekitten.com/100/100', ...commonProps } }
};