import React from 'react';
import { inject } from 'mobx-react';
import makeStyles from '@material-ui/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles({
  list: {
    width: '100%',
    overflow: 'auto',
    maxHeight: 300
  }
});

export const EditKeyframe = inject('formBuilderStore')(
  observer(({ index, formBuilderStore }: any) => {
    const classes = useStyles();
    const { selectedIndex, editComponentProperty, currentComponent } = formBuilderStore;
    const keyframe = currentComponent.properties.keyframes[index];
    if (!keyframe) return null;
    const { time, translate, rotate, scale, opacity } = keyframe;
    return (
      <>
        <div style={{ padding: '0.5rem' }}>
          <TextField
            label={'Time'}
            value={time}
            type="number"
            inputProps={{ step: "0.1" }}
            disabled={index === 0}
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'time', Number(e.target.value), 'keyframes', index);
            }}
          />
        </div>
        <div style={{ padding: '0.5rem' }}>
          <TextField
            label={'Translate'}
            value={translate}
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'translate', e.target.value, 'keyframes', index);
            }}
          />
        </div>
        <div style={{ padding: '0.5rem' }}>
          <TextField
            label={'Rotate'}
            value={rotate}
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'rotate', e.target.value, 'keyframes', index);
            }}
          />
        </div>
        <div style={{ padding: '0.5rem' }}>
          <TextField
            label={'Scale'}
            value={scale}
            inputProps={{ min: "0", step: "0.1" }}
            type="number"
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'scale', e.target.value, 'keyframes', index);
            }}
          />
        </div>
        <div style={{ padding: '0.5rem' }}>
          <TextField
            label={'Opacity'}
            value={opacity}
            inputProps={{ min: "0", max: "1", step: "0.1" }}
            type="number"
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'opacity', e.target.value, 'keyframes', index);
            }}
          />
        </div>
      </>
    );
  })
);
