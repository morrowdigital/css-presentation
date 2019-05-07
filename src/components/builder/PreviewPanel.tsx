import React from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { inject, observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { findDOMNode } from 'react-dom';
import Divider from '@material-ui/core/Divider';
import { KeyframeWrapper } from './elements/KeyframeWrapper';
import { componentLookup } from './elements';

const containerTarget = {
  drop(props: any, monitor: any, component: any) {
    const comp = findDOMNode(component) as Element;
    const item = monitor.getItem();
    const hoverBoundingRect = comp.getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top - item.height;
    const hoverClientX = clientOffset.x - hoverBoundingRect.left - item.width / 2;
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

class ComponentWrapper extends React.Component<any> {
  public ref: HTMLDivElement | null = null;
  render() {
    const { isDragging, connectDragSource, children } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    // const border = isDragging ? '1px black dotted' : undefined;
    return connectDragSource(
      <div ref={ref => (this.ref = ref)} style={{ opacity, display: 'inline-block', position: 'absolute', transform: 'translate3d(0, 0, 0)' }}>
        {children}
      </div>
    );
  }
}

const DropContainer = DragSource('component', componentSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(ComponentWrapper);

export const PreviewPanel = observer(({ connectDropTarget, formBuilderStore, SaveButton }) => {
  const { clearAll, form, moveComponentInSurvey, addComponentToSurvey, selectCurrentComponent } = formBuilderStore;

  return connectDropTarget(
    <div style={{ height: '100%' }}>
      <Typography variant="h4">Preview</Typography>
      <Divider style={{ marginBottom: '0.5em' }} />
      <Button style={{ position: 'absolute', right: '1em', top: '0.5rem' }} onClick={clearAll}>
        Clear all
      </Button>
      <Divider style={{ marginBottom: '0.5em', marginTop: '0.5em' }} />
      {form.length > 0 ? (
        form.map((component: any, index: any) => {
          const Component = componentLookup[component.code];
          return (
            <DropContainer
              moveComponentInSurvey={moveComponentInSurvey}
              addComponentToSurvey={addComponentToSurvey}
              index={index}
              key={index}
            >
              <KeyframeWrapper
                {...component.properties}
                select={() => selectCurrentComponent(index)}
                index={index}
                Component={Component}
              />
            </DropContainer>
          );
        })
      ) : (
        <Typography>Drag components from the left into this panel</Typography>
      )}
    </div>
  );
});

export default inject('formBuilderStore')(observer(DropTarget('component', containerTarget, collect)(PreviewPanel)));