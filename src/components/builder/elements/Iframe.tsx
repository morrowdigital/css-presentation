import * as React from 'react';
import { observer } from 'mobx-react-lite';

export interface IIFrameProps {
  src: string;
  containerWidth: string;
  padding: string;
  containerHeight: string;
  overflow: string;
  iframeWidth: string;
  iframeHeight: string;
  iframeScale: number;
}

export const Iframe = observer(
  ({
    src,
    containerWidth,
    padding,
    containerHeight,
    overflow,
    iframeWidth,
    iframeHeight,
    iframeScale
  }: IIFrameProps) => {
    return (
      <div
        style={{
          width: containerWidth,
          height: containerHeight,
          overflow,
          padding,
          background: 'black',
          boxSizing: 'content-box'
        }}
      >
        <iframe
          src={src}
          style={{
            height: iframeHeight,
            width: iframeWidth,
            transform: `scale(${iframeScale})`,
            transformOrigin: '0 0'
          }}
        />
      </div>
    );
  }
);
