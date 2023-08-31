import type { Ref } from 'vue';
import type { mxEditor } from 'mxgraph';
import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import { onUnmounted } from 'vue';
import type MyGraph from './useGraphGraph';
import type { PowerGraphExpose, PowerGraphProps } from '@/type/graphTyped';
import type { GraphSetState } from '@/hook/useGraphState';
import mx from '@/hook/useGraphFactory';
import { bus } from '@/utils/bus';
const { mxConstants, mxEvent } = mx;

export default (
  graph: Ref<MyGraph>,
  editor: Ref<mxEditor>,
  props: PowerGraphProps,
  state: GraphSetState,
  expose: PowerGraphExpose
) => {
  let emits = graph?.value?.getComponentEmits();
  let oldXml = '';
  const emitGraphChange = debounce(() => {
    emits || (emits = graph?.value?.getComponentEmits());
    const xml = expose?.getXml();
    if (xml !== oldXml) {
      oldXml = xml;
      if (expose.isJustCovertBpmn()) {
        return;
      }
      emits('graphChanged');
    }
  }, 100);
  const emitGraphClick = debounce(() => {
    const cells = graph.value.getSelectionCells();
    if (cells.length === 0) {
      if (expose.isJustCovertBpmn()) {
        return;
      }
      emits('graphClick');
    }
  }, 100);
  const listener = () => {
    emits = graph?.value?.getComponentEmits();
    graph?.value?.getSelectionModel()?.addListener(mx.mxEvent.CHANGE, () => {
      emitGraphChange();
      emitGraphClick();
    });
    graph?.value?.getModel()?.addListener(mx.mxEvent.CHANGE, () => {
      emitGraphChange();
      emitGraphClick();
    });
    graph.value.connectionHandler?.addListener(mxEvent.CONNECT, function (sender, evt) {
      if (props?.allowEdgeNoTarget) {
        return;
      }
      let edge = evt.getProperty('cell'); // 获取刚创建的连线
      edge.id = `Flow_${nanoid(7)}`;
      let source = edge.source; // 连线的起始节点
      let target = edge.target; // 连线的目标节点
      // 判断起始节点和目标节点是否为空，如果为空则取消连接
      if (!source || !target) {
        graph.value.getModel().remove(edge);
      }
    });
  };
  bus.off(mxConstants.CUSTOM_GRAPH_CREATED, listener);
  bus.on(mxConstants.CUSTOM_GRAPH_CREATED, listener);
  onUnmounted(() => {
    bus.off(mxConstants.CUSTOM_GRAPH_CREATED, listener);
  });
};
