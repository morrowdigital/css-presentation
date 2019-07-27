import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { FormBuilder } from '../components/builder/FormBuilder';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flex: 1
  }
});

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <FormBuilder />
    </div>
  );
};

export default Home;
