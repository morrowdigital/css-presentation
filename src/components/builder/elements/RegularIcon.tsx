import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName, SizeProp } from '@fortawesome/fontawesome-svg-core';

const useStyles = makeStyles({
  icon: { height: '1em' }
});

export interface IRegularIconProps {
  icon: IconName;
  color: string;
  size: SizeProp;
}

export const RegularIcon = observer(({ icon, color, size }: IRegularIconProps) => {
  const classes = useStyles();
  return <FontAwesomeIcon icon={['fas', icon]} className={classes.icon} color={color} size={size} />;
});
