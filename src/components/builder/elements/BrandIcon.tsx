import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName, SizeProp } from '@fortawesome/fontawesome-svg-core';

const useStyles = makeStyles({
  icon: { height: '1em' }
});

export interface IBrandIconProps {
  icon: IconName;
  color: string;
  size: SizeProp;
}

export const BrandIcon = observer(({ icon, color, size }: IBrandIconProps) => {
  const classes = useStyles();
  return <FontAwesomeIcon icon={['fab', icon]} className={classes.icon} color={color} size={size} />;
});
