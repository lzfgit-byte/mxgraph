import { useMagicKeys } from '@vueuse/core';
import type { Ref } from 'vue';
import { onMounted, ref, watchEffect } from 'vue';
import mx from './useGraphFactory';
import type { MyGraph } from '@/hook/useGraphGraph';
import type { PowerGraphExpose } from '@/type/graphTyped';
const { mxClipboard } = mx;
export interface GraphShortsMapType {
  name: string;
  key: string;
}
export const graphShortsMap: Ref<GraphShortsMapType[]> = ref([]);
export default (graph: Ref<MyGraph>, expose: PowerGraphExpose) => {
  const el = ref<HTMLDivElement>();
  const graphGetMouse = ref(false);
  const addShortMap = (item: GraphShortsMapType) => {
    if (graphShortsMap.value.some((i) => i.key === item.key)) {
      return;
    }
    graphShortsMap.value.push(item);
  };
  addShortMap({ name: '全选', key: 'ctrl+a' });
  addShortMap({ name: '复制', key: 'ctrl+c' });
  addShortMap({ name: '剪切', key: 'ctrl+x' });
  addShortMap({ name: '粘贴', key: 'ctrl+v' });
  addShortMap({ name: '撤销', key: 'ctrl+z' });
  addShortMap({ name: '重做', key: 'ctrl+y' });
  addShortMap({ name: '删除', key: 'delete 或 ctrl+d' });
  addShortMap({ name: '恢复默认', key: 'ctrl+q' });
  addShortMap({ name: '临时保存', key: 'ctrl+s' });
  addShortMap({ name: '加载临时保存', key: 'ctrl+l' });
  const { v, a, c, z, y, q, s, x, l, ctrl, Delete, d } = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if (
        ctrl.value &&
        (a.value || d.value || s.value || l.value || q.value) &&
        graphGetMouse.value
      ) {
        e.preventDefault();
      }
    },
  });
  watchEffect(() => {
    if (graphGetMouse.value) {
      if (ctrl.value && a.value) {
        graph.value.selectAll(graph.value.getDefaultParent());
      }
      if (ctrl.value && c.value) {
        mxClipboard.copy(graph.value);
      }
      if (ctrl.value && x.value) {
        mxClipboard.cut(graph.value);
      }
      if (ctrl.value && v.value) {
        if (graph.value.isEnabled() && !graph.value.isCellLocked(graph.value.getDefaultParent())) {
          mxClipboard.paste(graph.value);
        }
      }
      if (ctrl.value && z.value) {
        graph.value.actions.undoManager.undo();
      }
      if (ctrl.value && y.value) {
        graph.value.actions.undoManager.redo();
      }
      if (Delete.value) {
        const cells = graph.value.getSelectionCells();
        graph.value.deleteCells(cells);
      }
      if (ctrl.value && d.value) {
        const cells = graph.value.getSelectionCells();
        graph.value.deleteCells(cells);
      }
      if (ctrl.value && s.value) {
        expose.tempSave();
      }
      if (ctrl.value && l.value) {
        expose.loadTempSave();
      }
      if (ctrl.value && q.value) {
        graph?.value.zoomActual();
      }
    }
  });
  onMounted(() => {
    el.value.onmouseenter = () => {
      graphGetMouse.value = true;
    };
    el.value.onmouseleave = () => {
      graphGetMouse.value = false;
    };
    el.value.onwheel = (evt) => {
      if (graphGetMouse.value) {
        if (ctrl.value) {
          if (evt.deltaY < 0) {
            graph.value.zoomIn();
          } else {
            graph.value.zoomOut();
          }
        }
        evt.preventDefault();
      }
    };
  });
  return { el };
};
