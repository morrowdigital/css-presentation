import React, { ReactNode } from 'react';
import { DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec, ConnectDragSource } from 'react-dnd';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { observer } from 'mobx-react';
import { components, componentLookup } from './elements';

const componentSource: DragSourceSpec<{ surveyKey: string }, any> = {
  beginDrag: ({ surveyKey }, monitor, component) => {
    return { surveyKey: surveyKey, width: component.ref.clientWidth, height: component.ref.clientHeight };
  }
};
function collect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

interface IWrapperProps {
  connectDragSource: ConnectDragSource;
  children: ReactNode;
}

class ComponentWrapper extends React.Component<IWrapperProps> {
  public ref: HTMLDivElement | null = null;
  render() {
    const { connectDragSource, children } = this.props;
    return connectDragSource(
      <div
        ref={ref => (this.ref = ref)}
        className="py-1"
        style={{ border: 'grey dashed 1px', marginBottom: '10px', display: 'flex' }}
      >
        {children}
      </div>
    );
  }
}
const DraggableComponent = DragSource('component', componentSource, collect)(ComponentWrapper);

export const ComponentPanel = observer(() => {
  return (
    <>
      <Typography variant="h4">Components</Typography>
      <Divider style={{ marginBottom: '0.5em', width: '100%' }} />

      {Object.keys(components).map(key => {
        const component = components[key];
        const Component = componentLookup[component.code];
        return (
          <DraggableComponent key={component.code} surveyKey={component.code}>
            <Component {...component.properties} />
          </DraggableComponent>
        );
      })}
    </>
  );
});
