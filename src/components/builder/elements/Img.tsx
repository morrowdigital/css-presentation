import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    width: '100px',
    height: '100px'
  }
});

export interface IImgProps {
  src: string;
}

export const Img = observer(({ src }: IImgProps) => {
  const classes = useStyles();
  return <img src={src} className={classes.container} />;
});
