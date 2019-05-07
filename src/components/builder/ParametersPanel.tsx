import React from 'react';
import { inject, observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { Keyframes } from './Keyframes';
let fieldType: any = null;

export const ParametersPanel = inject('formBuilderStore')(
  observer(({ formBuilderStore }) => {
    const {
      currentComponent,
      duplicateField,
      removeField,
      selectedIndex,
      editComponentProperty,
      removeComponent
    } = formBuilderStore;
    const mapProperties = (obj: any, propertyName: any, depth?: number) => {
      if (typeof depth === 'number') {
        depth++;
      } else {
        depth = 1;
        fieldType = null;
      }
      if (!Number.isInteger(parseInt(propertyName, 0))) {
        fieldType = propertyName;
      }

      return (
        <div id={propertyName}>
          {Object.keys(obj).map((property, index) => {
            const type = fieldType;
            return (
              <React.Fragment key={index}>
                {depth === 2 ? (
                  <div>
                    <Typography inline>
                      {type} {index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        duplicateField(selectedIndex, type, index);
                      }}
                    >
                      <Add />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        removeField(selectedIndex, type, index);
                      }}
                    >
                      <Remove />
                    </IconButton>
                  </div>
                ) : null}

                {typeof obj[property] === 'object' ? (
                  mapProperties(obj[property], property, depth)
                ) : (
                  <div style={{ padding: '0.5rem' }}>
                    <TextField
                      label={property}
                      value={obj[property]}
                      fullWidth
                      onChange={
                        fieldType
                          ? e => {
                              editComponentProperty(selectedIndex, property, e.target.value, type, propertyName);
                            }
                          : e => {
                              editComponentProperty(selectedIndex, property, e.target.value);
                            }
                      }
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {depth === 1 ? <Divider variant="middle" /> : null}
        </div>
      );
    };
    const { keyframes, duration, delay, ...rest }: any = currentComponent.properties || {};
    return (
      <>
        <Typography variant="h4">Properties</Typography>
        <Divider style={{ marginBottom: '0.5em' }} />
        {currentComponent ? (
          <IconButton
            style={{ position: 'absolute', right: '1em', top: '0.1em' }}
            onClick={() => removeComponent(selectedIndex)}
          >
            <Delete />
          </IconButton>
        ) : null}
        {currentComponent ? (
          <>
            {rest && mapProperties(rest, null, 0)}

            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Duration'}
                value={duration}
                fullWidth
                onChange={e => {
                  editComponentProperty(selectedIndex, 'duration', e.target.value);
                }}
              />
            </div>
            <div style={{ padding: '0.5rem' }}>
              <TextField
                label={'Delay'}
                value={delay}
                fullWidth
                onChange={e => {
                  editComponentProperty(selectedIndex, 'delay', e.target.value);
                }}
              />
            </div>
            <Keyframes />
          </>
        ) : (
          <Typography>Select a component in the preview pane to edit it's properties </Typography>
        )}
      </>
    );
  })
);
