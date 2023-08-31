import { forIn } from 'lodash';
import mx from '@/hook/useGraphFactory';
import useGraphShape from '@/hook/useGraphShape';
import useGraphStencil from '@/hook/useGraphStencil';
import useGraphPolyfill from '@/hook/useGraphPolyfill';
useGraphStencil();
useGraphPolyfill();
const {
  mxConnectionHandler,
  mxConstants,
  mxImage,
  mxConstraintHandler,
  mxVertexHandler,
  mxCellHighlight,
  mxEdgeHandler,
  mxCell,
  mxEvent,
} = mx;
mxConstants.HANDLE_FILLCOLOR = '#29b6f2';
mxConstants.HANDLE_STROKECOLOR = '#0088cf';
mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
mxConstants.OUTLINE_COLOR = '#00a8ff';
mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#99ccff';
mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#00a8ff';
mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
mxConstants.EDGE_SELECTION_COLOR = '#00a8ff';
mxConstants.DEFAULT_VALID_COLOR = '#00a8ff';
mxConstants.LABEL_HANDLE_FILLCOLOR = '#cee7ff';
mxConstants.GUIDE_COLOR = '#0088cf';
mxConstants.HIGHLIGHT_OPACITY = 30;
mxConstants.HIGHLIGHT_SIZE = 5;

// 连接点
mxConstraintHandler.prototype.pointImage = new mxImage(
  'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1cHgiIGhlaWdodD0iNXB4IiB2ZXJzaW9uPSIxLjEiPjxwYXRoIGQ9Im0gMCAwIEwgNSA1IE0gMCA1IEwgNSAwIiBzdHJva2U9IiMyOWI2ZjIiLz48L3N2Zz4=',
  5,
  5
);
mxConnectionHandler.prototype.outlineConnect = true;
mxConnectionHandler.prototype.connectImage = new mxImage(
  'data:image/gif;base64,R0lGODlhCgAKAOZPAP7//1qt4afV7S+b2WCy4Vms4CqY0/L3/Z/Q8NPr92Gz4jOb2mWz49Lr8tLq9uvy+tPp9+Xy+mK14ejy+1ux4Fus4evx//7+/mm35fv//qfU69fp9Vis26HP8DGb1dTq+PH5+zOc1v38/yma1P79/zSc2e3x+lKs4Gez5Fiu4SmX1imW1zKa2V2w4jOe1C2Z2i+c1Vyu4Fiu3zOd1//+/1ir3Wiy36HS8PH7/M7o9V6w3+j1/Vmv4PL2/1Ot35/Q8S2W2DCb02O33OP1+e75+yaZ0lus4y6d1V6w4ub09+/6/qfV79jq+PX4/1it4////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAE8ALAAAAAAKAAoAAAdigE9PSgISCgIggk9MAy46SAswG08HLzw7AAAPFSMHN0FDHy0FCRFHHQUoND5AKycANk4yQiQ1KkUcFxgBCCVJDjFGDRYePz0GKRMZIiYBBkRPOSwhBBQzAxCKOEsMBBpNgoEAOw==',
  10,
  10
);
// 禁止从节点中心拖拽出线条
mxConnectionHandler.prototype.isConnectableCell = () => false;

mxCellHighlight.prototype.keepOnTop = true;
mxVertexHandler.prototype.parentHighlightEnabled = true;

mxEdgeHandler.prototype.snapToTerminals = true;
mxEdgeHandler.prototype.parentHighlightEnabled = true;
mxEdgeHandler.prototype.dblClickRemoveEnabled = false;
mxEdgeHandler.prototype.straightRemoveEnabled = true;
mxEdgeHandler.prototype.virtualBendsEnabled = true;
mxEdgeHandler.prototype.mergeRemoveEnabled = true;
mxEdgeHandler.prototype.manageLabelHandle = true;
mxEdgeHandler.prototype.outlineConnect = true;

// 扩展mxCell
mxCell.prototype.getCustomData = function (key) {
  return this.businessData && (this.businessData[key] || '');
};
mxCell.prototype.setCustomData = function (key, value) {
  this.businessData = this.businessData || {};
  this.businessData[key] = value;
};
// 扩展mxConstants
mxConstants.CUSTOM_TOOLTIP = 'tooltip';
mxConstants.CUSTOM_TOOLTIP_STATIC_CLASS = 'customTooltipStaticClass';
mxConstants.CUSTOM_NODESET_JUMP = 'customNodesetJump';
mxConstants.CUSTOM_OVERLY_ICON = 'customOverlyIcon';
mxConstants.CUSTOM_CELL_UNIQUE_KEY = 'customCellUniqueKey';
mxConstants.CUSTOM_BPMN_DATA_KEY = 'customBpmnDataKey';
mxConstants.CUSTOM_BPMN_LABEL = 'customBpmnLabel';
mxConstants.CUSTOM_BPMN_NODE_CHILD = 'customBpmnNodeChild';
mxConstants.CUSTOM_EOL = '\r\n';
mxConstants.CUSTOM_BPMN_EDGE_INFOS = 'customBpmnEdgeInfos';
mxConstants.CUSTOM_BPMN_PROCESS_INFO = 'customBpmnProcessInfo';
mxConstants.CUSTOM_GRAPH_CREATED = 'customGraphCreated';

// 扩展 mxEvent
mxEvent.CUSTOM_NODESET_TOOLTIP = 'customNodesetTooltip';
mxEvent.CUSTOM_NODESET_JUMP_CLICK = 'customNodesetJumpClick';
mxEvent.CUSTOM_CLEAR_ALL_ICON = 'customClearAllIcon';
// 自定义cell渲染
// useGraphCellRender();

forIn(mx, (value, key) => {
  window[key] = window[key] || mx[key];
});
useGraphShape();
export default () => {};
