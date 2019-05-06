import * as React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { FormBuilder } from '../components/builder/FormBuilder';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1
  }
}));

interface IHomeProps {}

const Home = (props: IHomeProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <FormBuilder />
    </div>
  );
};

export default Home;
