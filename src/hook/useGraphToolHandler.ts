import mx from '../hook/useGraphFactory';
import MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
const { mxVertexHandler, mxClient } = mx;
function CustommxVertexToolHandler(state) {
  mxVertexHandler.apply(this, arguments);
}

CustommxVertexToolHandler.prototype = new mxVertexHandler();
CustommxVertexToolHandler.prototype.constructor = CustommxVertexToolHandler;

CustommxVertexToolHandler.prototype.domNode = null;

CustommxVertexToolHandler.prototype.init = function () {
  mxVertexHandler.prototype.init.apply(this, arguments);
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.whiteSpace = 'nowrap';
  container.style.width = '20px';
  container.style.height = '20px';
  container.style.background = '#ccc';
  this.domNode = container;
  this.graph.container.appendChild(this.domNode);
  this.redrawTools();
};

CustommxVertexToolHandler.prototype.redraw = function () {
  mxVertexHandler.prototype.redraw.apply(this);
  this.redrawTools();
};

CustommxVertexToolHandler.prototype.redrawTools = function () {
  if (this.state != null && this.domNode != null) {
    let dy = mxClient.IS_VML && document.compatMode === 'CSS1Compat' ? 20 : 4;
    this.domNode.style.left = `${this.state.x + this.state.width - 56}px`;
    this.domNode.style.top = `${this.state.y + this.state.height + dy}px`;
  }
};

CustommxVertexToolHandler.prototype.destroy = function () {
  mxVertexHandler.prototype.destroy.apply(this, arguments);

  if (this.domNode != null) {
    this.domNode.parentNode.removeChild(this.domNode);
    this.domNode = null;
  }
};
export default (graph: MyGraph) => {
  graph.createHandler = function (state) {
    if (state != null && this.model.isVertex(state.cell)) {
      return new CustommxVertexToolHandler(state);
    }
    return MyGraph.prototype.createHandler.apply(this, arguments);
  };
};
