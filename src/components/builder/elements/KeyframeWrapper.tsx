import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import FormBuilderStore from '../../../mobx/formBuilderStore';

const makeTransformCss = (transform: object) =>
  `transform: ${Object.keys(transform)
    .map(key => `${key}(${transform[key]})`)
    .join(' ')} translateZ(0);`;

export const KeyframeWrapper = inject('formBuilderStore')(
  observer(({ delay, index, duration, keyframes, Component, select, formBuilderStore, ...rest }: any) => {
    if (keyframes && index > -1) {
      let keyfCSS = `@keyframes animation${index} { `;
      const times: number[] = keyframes.map(({ time }: { time: number }) => time);
      const points = times.sort((a: number, b: number) => a - b);
      const length = points[points.length - 1] - points[0];
      if (keyframes.length > 1) {
        keyframes.forEach(
          ({ time, opacity, ...transform }: any) =>
            (keyfCSS += `${(Number(time) / length) * 100}% { ${makeTransformCss(transform)} opacity: ${opacity}; }`)
        );
      } else {
        const { time, opacity, ...transform } = keyframes[0];
        keyfCSS += `0% { ${makeTransformCss(transform)} opacity: ${opacity}; }`;
        keyfCSS += `100% { ${makeTransformCss(transform)} opacity: ${opacity}; }`;
      }
      keyfCSS += ' }';
      (document.styleSheets[0] as any).deleteRule(index);
      (document.styleSheets[0] as any).insertRule(keyfCSS, index);
    }
    const { animationState, resetting } = formBuilderStore as FormBuilderStore;
    return (
      <div
        onClick={select}
        style={{
          animation: resetting ? 'none' :  `${
            duration ? duration : 0.01
          }s calc(var(--offset) + ${delay}s ) ${animationState} 1 linear both animation${index}`
        }}
      >
        <Component {...rest} />
      </div>
    );
  })
);
