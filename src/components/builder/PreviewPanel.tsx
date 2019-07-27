import React, { ReactChild, ReactNode } from 'react';
import { DropTarget, DragSource, DragElementWrapper, DragSourceOptions } from 'react-dnd';
import { inject, observer as observerClass } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { findDOMNode } from 'react-dom';
import Divider from '@material-ui/core/Divider';
import { KeyframeWrapper } from './KeyframeWrapper';
import { componentLookup, IFormComponent } from './elements';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Fullscreen from '@material-ui/icons/Fullscreen';
import Play from '@material-ui/icons/PlayArrow';
import FormBuilderStore from '../../mobx/formBuilderStore';
import { makeStyles } from '@material-ui/styles';

const containerTarget = {
  drop(props: any, monitor: any, component: any) {
    const comp = findDOMNode(component) as Element;
    const item = monitor.getItem();
    const hoverBoundingRect = comp.getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top - item.height;
    const hoverClientX =
      clientOffset.x -
      hoverBoundingRect.left -
      (item.width / 2) * props.formBuilderStore.containerProperties.containerScale;
    return monitor.isOver() && monitor.getItem().surveyKey
      ? props.formBuilderStore.addComponentToSurvey(monitor.getItem().surveyKey, false, hoverClientX, hoverClientY)
      : props.formBuilderStore.moveComponentInSurvey(monitor.getItem().index, 0, hoverClientX, hoverClientY);
  }
};
function collect(connect: any, monitor: any) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const componentSource = {
  beginDrag: (props: any, monitor: any, component: any) => {
    return { index: props.index, width: component.ref.clientWidth, height: component.ref.clientHeight };
  }
};

interface IComponentWrapperProps {
  isDragging: boolean;
  connectDragSource: DragElementWrapper<DragSourceOptions>;
  children: ReactNode;
  zIndex: number;
}

class ComponentWrapper extends React.Component<IComponentWrapperProps> {
  public ref: HTMLDivElement | null = null;
  render() {
    const { isDragging, connectDragSource, children, zIndex } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    // const border = isDragging ? '1px black dotted' : undefined;
    return connectDragSource(
      <div
        ref={ref => (this.ref = ref)}
        style={{
          pointerEvents: 'none',
          opacity,
          display: 'inline-block',
          position: 'absolute',
          transform: 'translate3d(0, 0, 0)',
          zIndex
        }}
      >
        {children}
      </div>
    );
  }
}

const exportJson = (form: IFormComponent[], containerProperties: any) => {
  var dataUri =
    'data:application/text;charset=utf-8,' + encodeURIComponent(JSON.stringify({ form, containerProperties }, null, 2));
  var link = document.createElement('a');
  link.download = 'FormBuilderExport.json';
  link.href = dataUri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const importJson = (target: EventTarget & HTMLInputElement, setProject: (form: string) => void) => {
  const fileReader = new FileReader();
  if (!target.files) return;
  fileReader.readAsText(target.files[0]);
  fileReader.onload = (e: any) => {
    setProject(e.target.result);
  };
};

const DropContainer = DragSource('component', componentSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(ComponentWrapper);

const useStyles = makeStyles({
  container: {
    '&:fullScreen': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& > div': {
        transformOrigin: 'unset !important',
        transform: 'scale(1) !important'
      }
    }
  }
});

const FullscrenContainer = ({ children }: { children: ReactChild }) => {
  const classes = useStyles();
  return (
    <div className={classes.container} ref={ref => (containerRef = ref)}>
      {children}
    </div>
  );
};

let containerRef: HTMLDivElement | null;
export const PreviewPanel = observerClass(({ connectDropTarget, formBuilderStore }: any) => {
  const {
    clearAll,
    form,
    setProject,
    moveComponentInSurvey,
    addComponentToSurvey,
    selectCurrentComponent,
    play,
    containerProperties
  } = formBuilderStore as FormBuilderStore;
  const { height, containerScale, width } = containerProperties;
  return (
    <div style={{ height: '100%' }}>
      <Typography variant="h4">
        Preview{' '}
        <IconButton
          color="primary"
          style={{ padding: 0 }}
          onClick={() => containerRef && containerRef.requestFullscreen() && play()}
        >
          <Fullscreen fontSize="large" />
          <Play style={{ position: 'absolute' }} fontSize="small" />
        </IconButton>
      </Typography>
      <Divider style={{ marginBottom: '0.5em' }} />
      <div style={{ position: 'absolute', right: '1em', top: '0.5rem' }}>
        <Button onClick={() => exportJson(form, containerProperties)}>Export</Button>
        <Button component="label">
          Import{' '}
          <input type="file" onChange={({ target }) => importJson(target, setProject)} style={{ display: 'none' }} />
        </Button>
        <Button onClick={clearAll}>Clear all</Button>
      </div>
      <Divider style={{ marginBottom: '0.5em', marginTop: '0.5em' }} />
      <Grid container wrap="nowrap" justify="flex-start" alignItems="flex-start" style={{ height: 'calc(100% - 4em)' }}>
        <FullscrenContainer>
          {connectDropTarget(
            <div
              style={{
                minHeight: height,
                minWidth: width,
                maxHeight: height,
                maxWidth: width,
                transform: `scale(${containerScale})`,
                transformOrigin: '0 0',
                border: 'black 1px solid'
                // background: 'white'
              }}
              onClick={() => selectCurrentComponent(null)}
            >
              {form.length > 0 ? (
                form.map((component, index) => {
                  const Component = componentLookup[component.code];
                  return (
                    <DropContainer
                      moveComponentInSurvey={moveComponentInSurvey}
                      addComponentToSurvey={addComponentToSurvey}
                      index={index}
                      key={index}
                      zIndex={component.properties.zIndex}
                    >
                      <KeyframeWrapper {...component.properties} index={index} Component={Component} />
                    </DropContainer>
                  );
                })
              ) : (
                <Typography>Drag components from the left into this panel</Typography>
              )}
            </div>
          )}
        </FullscrenContainer>
      </Grid>
    </div>
  );
});

export default inject('formBuilderStore')(
  observerClass(DropTarget('component', containerTarget, collect)(PreviewPanel))
);
