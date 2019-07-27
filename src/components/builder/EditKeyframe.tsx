import React from 'react';
import { inject } from 'mobx-react';
import makeStyles from '@material-ui/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import FormBuilderStore from '../../mobx/formBuilderStore';

const useStyles = makeStyles({ field: { padding: '0.5rem' } });

interface IEditKeyframeProps {
  index: number;
  formBuilderStore?: FormBuilderStore;
}

export const EditKeyframe = inject('formBuilderStore')(
  observer(({ index, formBuilderStore }: IEditKeyframeProps) => {
    const classes = useStyles();
    const { selectedIndex, editComponentProperty, currentComponent } = formBuilderStore!;
    if (!currentComponent) return null;
    const keyframe = currentComponent.properties.keyframes[index];
    if (!keyframe) return null;
    const { time, translate, rotate, scale, opacity } = keyframe;
    return selectedIndex == null ? null : (
      <>
        <div className={classes.field}>
          <TextField
            label={'Time'}
            value={time}
            type="number"
            inputProps={{ step: '0.1' }}
            disabled={index === 0}
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'time', Number(e.target.value), 'keyframes', index);
            }}
          />
        </div>
        <div className={classes.field}>
          <TextField
            label={'Translate'}
            value={translate}
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'translate', e.target.value, 'keyframes', index);
            }}
          />
        </div>
        <div className={classes.field}>
          <TextField
            label={'Rotate'}
            value={rotate}
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'rotate', e.target.value, 'keyframes', index);
            }}
          />
        </div>
        <div className={classes.field}>
          <TextField
            label={'Scale'}
            value={scale}
            inputProps={{ min: '0', step: '0.1' }}
            type="number"
            fullWidth
            onChange={e => {
              editComponentProperty(selectedIndex, 'scale', e.target.value, 'keyframes', index);
            }}
          />
        </div>
        <div className={classes.field}>
          <TextField
            label={'Opacity'}
            value={opacity}
            inputProps={{ min: '0', max: '1', step: '0.1' }}
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
