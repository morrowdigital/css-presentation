import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles({
  container: {
    width: '100px',
    height: '100px'
  }
});

export const BrandIcon = observer(({ icon, color, size }: any) => {
  const classes = useStyles();
  return <FontAwesomeIcon icon={['fab', icon]} style={{height: '1em'}} color={color} size={size} />;
});