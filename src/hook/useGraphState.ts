import type { Ref } from 'vue';
import { onUnmounted, ref, watchEffect } from 'vue';
import { nanoid } from 'nanoid';
import { debounce } from 'lodash';
import mx from './useGraphFactory';
import type { PowerGraphProps } from '@/components/mxGraph/src/type/graphTyped';
import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
import { bus } from '@/utils/bus';
const { mxConstants, mxRubberband, mxEvent } = mx;
export interface GraphSetState {
  isSimpleM: Ref<boolean>;
  isSelectMouse: Ref<boolean>;
  translate?: Ref<[string, string]>;
}
const graphId = ref('');
const graphName = ref('');
export const setGraphInfo = (id: string, name: string) => {
  graphId.value = id;
  graphName.value = name;
};
export const getGraphInfo = () => ({ id: graphId.value, name: graphName.value });
export default (graph: Ref<MyGraph>, props: PowerGraphProps): GraphSetState => {
  graphId.value = props?.id || nanoid();
  graphName.value = props?.name || '';
  const isSelectMouse = ref(false);
  const isSimpleModel = ref(props.isSimpleModel);
  const isReadonly = ref(props.isReadonly);
  const translate = ref<[string, string]>(['0', '0']);
  const listener = () => {
    watchEffect(() => {
      isReadonly.value = props.isReadonly;
      if (isReadonly.value) {
        graph.value.panningHandler.useLeftButtonForPanning = true;
        graph.value.panningHandler.ignoreCell = true;
        graph.value.container.style.cursor = 'move';
        graph.value.setEnabled(false);
      } else {
        graph?.value?.setEnabled(true);
        graph.value.panningHandler.ignoreCell = false;
        graph.value.container.style.cursor = 'default';
      }
    });
    watchEffect(() => {
      if (isSelectMouse.value) {
        graph.value.panningHandler.useLeftButtonForPanning = false;
        graph.value.container.style.cursor = 'crosshair';
        graph.value.rubberband = new mxRubberband(graph.value);
      } else {
        graph.value.container.style.cursor = 'default';
        graph.value.panningHandler.useLeftButtonForPanning = true;
        graph.value.rubberband = null;
      }
    });
    const watchTransListener = debounce(() => {
      const trans = graph?.value?.view?.translate;
      translate.value = [trans?.x?.toFixed(0), trans?.y?.toFixed(0)];
    }, 200);
    graph.value.addListener(mxEvent.PAN_END, watchTransListener);
    graph.value.view.addListener(mxEvent.SCALE, watchTransListener);
    graph.value.view.addListener(mxEvent.SCALE_AND_TRANSLATE, watchTransListener);
    graph.value.view.addListener(mxEvent.TRANSLATE, watchTransListener);
  };
  bus.off(mxConstants.CUSTOM_GRAPH_CREATED, listener);
  bus.on(mxConstants.CUSTOM_GRAPH_CREATED, listener);
  onUnmounted(() => {
    bus.off(mxConstants.CUSTOM_GRAPH_CREATED, listener);
  });
  return { isSimpleM: isSimpleModel, isSelectMouse, translate };
};
