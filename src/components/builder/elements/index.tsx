import { Text } from './Text';
import { Img } from './Img';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fab, far);
import { BrandIcon } from './BrandIcon';
import { RegularIcon } from './RegularIcon';

export interface IFormComponents {
  [name: string]: {
    code: string;
    properties: object;
  };
}

export const componentLookup = {
  Text,
  Img,
  BrandIcon,
  RegularIcon
};

const commonProps = { delay: 0, duration: 0, keyframes: {}, zIndex: 1 };

export const components: IFormComponents = {
  Text: { code: 'Text', properties: { text: 'Some Text', ...commonProps } },
  Img: { code: 'Img', properties: { src: 'http://placekitten.com/100/100', ...commonProps } },
  BrandIcon: { code: 'BrandIcon', properties: { icon: 'react', color: 'lightblue', size: '5x', ...commonProps } },
  RegularIcon: { code: 'RegularIcon', properties: { icon: 'dizzy', color: 'lightblue', size: '5x', ...commonProps } }
};
