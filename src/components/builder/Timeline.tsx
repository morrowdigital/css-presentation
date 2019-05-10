import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles({
  timeline: {
    bottom: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: 10
  }
});

export const Timeline = inject('formBuilderStore')(
  observer(({ formBuilderStore }: any) => {
    const classes = useStyles();
    const { offsetSeconds, setOffset } = formBuilderStore;

    return (
      <div className={classes.timeline}>
        <Typography variant="body1">Timeline - {offsetSeconds}s</Typography>
        <Slider value={offsetSeconds} onChange={setOffset} step={0.1} min={0} />
      </div>
    );
  })
);
