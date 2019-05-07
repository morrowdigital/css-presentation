import React, { useState } from 'react';
import { inject } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/styles/makeStyles';
import FormBuilderStore, { IKeyframe } from '../../mobx/formBuilderStore';
import { EditKeyframe } from './EditKeyframe';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import Clear from '@material-ui/icons/Clear';
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
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
    const { currentComponent, addKeyframe, removeField, selectedIndex } = formBuilderStore as FormBuilderStore;
    const { keyframes } = currentComponent.properties;
    return (
      <>
        <Typography variant="h6">
          Keyframes
          <IconButton color="primary" onClick={() => addKeyframe(selectedIndex || 0)}>
            <Add />
          </IconButton>
        </Typography>
        <Paper>
          <List className={classes.list} dense>
            {keyframes &&
              keyframes.map((keyframe: IKeyframe, index: number) => (
                <ListItem key={index} selected={index === selected} onClick={() => setSelected(index)}>
                  <ListItemText primary={keyframe.time + 's'} />
                  <div>
                    <IconButton
                      disabled={index === 0}
                      color="primary"
                      onClick={() => removeField(selectedIndex || 0, 'keyframes', index)}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </div>
                </ListItem>
              ))}
          </List>
        </Paper>
        <EditKeyframe index={selected} />
      </>
    );
  })
);
