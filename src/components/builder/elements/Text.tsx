import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    width: '100px',
    height: '100px',
    background: 'lightblue'
  }
});

export const Text = observer(({ text }: any) => {
  const classes = useStyles();
  return <div className={classes.container}>{text}</div>;
});

