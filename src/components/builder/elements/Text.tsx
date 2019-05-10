import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

// const useStyles = makeStyles({
//   container: {
//     width: '100px',
//     height: '100px',
//     background: 'lightblue'
//   }
// });

export const Text = observer(({ text }: any) => {
  // const classes = useStyles();
  return <Typography>{text}</Typography>;
});

