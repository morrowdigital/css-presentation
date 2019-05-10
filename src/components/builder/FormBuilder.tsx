import React from 'react';
import { ComponentPanel } from './ComponentPanel';
import PreviewPanel from './PreviewPanel';
import { ParametersPanel } from './ParametersPanel';
import Grid from '@material-ui/core/Grid';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { Timeline } from './Timeline';

import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import FormBuilderStore from '../../mobx/formBuilderStore';
import Play from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';

const PlayButton = inject('formBuilderStore')(
  observer(({ formBuilderStore }: any) => {
    const { animationState, play, pause } = formBuilderStore as FormBuilderStore;

    return animationState === 'paused' ? (
      <IconButton color="primary" onClick={play}>
        <Play />
      </IconButton>
    ) : (
      <IconButton color="primary" onClick={pause}>
        <Pause />
      </IconButton>
    );
  })
);

export const containerStyle = { height: '100%', overflow: 'auto', border: '#eee 1px solid', padding: '0.5em' };

const useStyles = makeStyles(theme => ({
  containerStyle,
  middleContainerStyle: { ...containerStyle, borderLeft: 'none', borderRight: 'none', position: 'relative' }
}));

export const FormBuilder = () => {
  const classes = useStyles();

  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <Grid container>
        <Grid className={classes.containerStyle} container direction="column" alignItems="baseline" item xs={3}>
          <ComponentPanel />
        </Grid>
        <Grid className={classes.middleContainerStyle} item xs={6}>
          <PreviewPanel/>
          <Grid container direction="row" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <PlayButton />
            <Timeline />
          </Grid>
        </Grid>
        <Grid className={classes.containerStyle} item xs={3}>
          <ParametersPanel />
        </Grid>
      </Grid>
    </DragDropContextProvider>
  );
};
