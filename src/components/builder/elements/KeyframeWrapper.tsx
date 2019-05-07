import * as React from 'react';
import { observer } from 'mobx-react-lite';

export const KeyframeWrapper = observer(({ delay, index, duration, keyframes, Component, select, ...rest }: any) => {
  if (keyframes && index > -1) {
    let keyfCSS = `@keyframes animation${index} { `;
    const times: number[] = keyframes.map(({ time }: { time: number }) => time);
    const points = times.sort((a: number, b: number) => a - b);
    const length = points[points.length - 1] - points[0];
    if (keyframes.length > 1) {
      keyframes.forEach(
        ({ time, ...rest }: any) =>
          (keyfCSS += `${(Number(time) / length) * 100}% { transform: ${Object.keys(rest)
            .map(key2 => `${key2}(${rest[key2]})`)
            .join(' ')}; }`)
      );
    } else {
      const { time, ...rest } = keyframes[0];
      keyfCSS += `0% { transform: ${Object.keys(rest)
        .map(key2 => `${key2}(${rest[key2]})`)
        .join(' ')}; }`;
      keyfCSS += `100% { transform: ${Object.keys(rest)
        .map(key2 => `${key2}(${rest[key2]})`)
        .join(' ')}; }`;
    }
    keyfCSS += ' }';
    (document.styleSheets[0] as any).deleteRule(index);
    (document.styleSheets[0] as any).insertRule(keyfCSS, index);
  }
  return (
    <div
      onClick={select}
      style={{
        animation: `${duration ? duration : 0.01}s calc(var(--offset) + ${delay}s ) paused linear both animation${index}`
      }}
    >
      <Component {...rest} />
    </div>
  );
});
