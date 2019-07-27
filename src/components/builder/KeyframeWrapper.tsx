import * as React from 'react';
import { observer } from 'mobx-react';
import { inject } from 'mobx-react';
import FormBuilderStore, { IKeyframe } from '../../mobx/formBuilderStore';

const makeTransformCss = (transform: object) =>
  `transform: ${Object.keys(transform)
    .map(key => `${key}(${transform[key]})`)
    .join(' ')} translateZ(0);`;

interface IKeyframeWrapper {
  delay: number;
  index: number;
  duration: number;
  keyframes: IKeyframe[];
  Component: React.ComponentType<any>;
  formBuilderStore?: FormBuilderStore;
}

// this should prob just get all the info from form builder store (except index)
export const KeyframeWrapper = inject('formBuilderStore')(
  observer(({ delay, index, duration, keyframes, Component, formBuilderStore, ...rest }: IKeyframeWrapper) => {
    if (keyframes && index > -1) {
      let keyfCSS = `@keyframes animation${index} { `;
      const times: number[] = keyframes.map(({ time }: { time: number }) => time);
      const points = times.sort((a: number, b: number) => a - b);
      const length = points[points.length - 1] - points[0];
      if (keyframes.length > 1) {
        keyframes.forEach(
          ({ time, opacity, id, ...transform }: IKeyframe) =>
            (keyfCSS += `${(Number(time) / length) * 100}% { ${makeTransformCss(transform)} opacity: ${opacity}; }`)
        );
      } else {
        const { time, opacity, id, ...transform } = keyframes[0];
        keyfCSS += `0% { ${makeTransformCss(transform)} opacity: ${opacity}; }`;
        keyfCSS += `100% { ${makeTransformCss(transform)} opacity: ${opacity}; }`;
      }
      keyfCSS += ' }';
      (document.styleSheets[0] as CSSStyleSheet).deleteRule(index);
      (document.styleSheets[0] as CSSStyleSheet).insertRule(keyfCSS, index);
    }
    const { animationState, resetting, selectCurrentComponent } = formBuilderStore as FormBuilderStore;
    return (
      <div
        onClick={e => {
          selectCurrentComponent(index);
          e.stopPropagation();
        }}
        style={{
          animation: resetting
            ? 'none'
            : `${
                duration ? duration : 0.01
              }s calc(var(--offset) + ${delay}s ) ${animationState} 1 linear both animation${index}`,
          pointerEvents: 'auto'
        }}
      >
        <Component {...rest} />
      </div>
    );
  })
);
