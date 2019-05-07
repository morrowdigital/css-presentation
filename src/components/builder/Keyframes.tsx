import React, { useState } from 'react';
import { inject } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/styles/makeStyles';
import { IKeyframe } from '../../mobx/formBuilderStore';
import { EditKeyframe } from './EditKeyframe';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles({
  list: {
    width: '100%',
    overflow: 'auto',
    maxHeight: 150
  }
});

export const Keyframes = inject('formBuilderStore')(
  observer(({ formBuilderStore }: any) => {
    const [selected, setSelected] = useState(0);
    const classes = useStyles();
    const { currentComponent } = formBuilderStore;
    const { keyframes } = currentComponent.properties;
    return (
      <>
        <Typography variant="h4">Keyframes</Typography>
        <Paper>
          <List className={classes.list} dense>
            {keyframes &&
              keyframes.map((keyframe: IKeyframe, index: number) => (
                <ListItem selected={index === selected} onClick={() => setSelected(index)}>
                  <ListItemText primary={keyframe.time + 's'} />
                </ListItem>
              ))}
          </List>
        </Paper>
        <EditKeyframe index={selected} />
      </>
    );
  })
);
