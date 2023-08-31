import type { Ref } from 'vue';
import { onMounted, shallowRef } from 'vue';
import type { mxEditor } from 'mxgraph';
import type { PowerGraphProps } from '@/type/graphTyped';
import MyGraph from '@/hook/useGraphGraph';
import mx from '@/hook/useGraphFactory';
import useGraphHandler from '@/hook/useGraphHandler';
import useGraphContentMenu from '@/hook/useGraphContentMenu';
import type { GraphEmitsType } from '@/const/emits';
import useGraphCellToolTip from '@/hook/useGraphCellToolTip';
import useGraphCellOverlay from '@/hook/useGraphCellOverlay';
import type { GraphSetState } from '@/hook/useGraphState';
import useGraphState from '@/hook/useGraphState';
import { bus } from '@/utils/bus';

export interface GraphSetReturnType {
  graph: Ref<MyGraph>;
  editor: Ref<mxEditor>;
  state: GraphSetState;
}
export default (props: PowerGraphProps, emits: GraphEmitsType): GraphSetReturnType => {
  const graph = shallowRef<MyGraph>();
  const editor = shallowRef<mxEditor>();
  const state = useGraphState(graph, props);
  onMounted(() => {
    editor.value = new mx.mxEditor();
    graph.value = new MyGraph(document.querySelector('.editor-container') as HTMLElement);
    editor.value.graph = graph.value;
    useGraphHandler(graph, props as any);
    graph.value._init();
    useGraphContentMenu(graph.value, state);
    // useGraphHoveIcons(graph.value);
    // 鸟瞰图
    new mx.mxOutline(graph.value, document.querySelector('.editor-outline') as HTMLElement);
    graph.value.getComponentEmits = () => emits;
    // 设置cell里的常显图标
    useGraphCellToolTip(graph.value);
    useGraphCellOverlay(graph.value);
    // 设置选中时的操作方法
    // useGraphToolHandler(graph.value);
    bus.emit(mx.mxConstants.CUSTOM_GRAPH_CREATED);
  });

  return { graph, editor, state };
};
