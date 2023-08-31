import { ElMessage } from 'element-plus';
import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
import mx from '@/components/mxGraph/src/hook/useGraphFactory';
import type { GraphSetState } from '@/components/mxGraph/src/hook/useGraphState';
const { mxConstants } = mx;

export default (graph: MyGraph, state: GraphSetState) => {
  graph.popupMenuHandler.autoExpand = true;
  graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
    const divEl: HTMLDivElement = menu.div;
    divEl.style.position = 'absolute';
    divEl.classList.add('custom-mxPopupMenu');
    const cells = graph.getSelectionCells();
    if (cells.length > 0) {
      if (graph.cellRightClick) {
        graph.cellRightClick(cells, menu);
      }
      menu.addItem('删除', undefined, graph.actions.get('delete').func.bind(this, this));
      menu.addItem('获取style', undefined, () => {
        ElMessage.info(cell.style);
      });
      menu.addItem('置顶', undefined, graph.actions.get('toFront').func.bind(this, this));
      menu.addItem('置底', undefined, graph.actions.get('toBack').func.bind(this, this));
      menu.addItem('组合', undefined, graph.actions.get('group').func.bind(this, this));
      menu.addItem('取消组合', undefined, graph.actions.get('ungroup').func.bind(this, this));
      if (cell.isEdge()) {
        menu.addItem('设置平滑箭头', undefined, () => {
          graph.setCellStyles(mxConstants.STYLE_EDGE, mxConstants.EDGESTYLE_ORTHOGONAL, [cell]);
        });
        menu.addItem('取消平滑', undefined, () => {
          graph.setCellStyles(mxConstants.STYLE_EDGE, '', [cell]);
        });
      }
      return;
    }
    menu.addItem('放大', undefined, graph.actions.get('zoomIn').func.bind(this, this));
    menu.addItem('缩小', undefined, graph.actions.get('zoomOut').func.bind(this, this));
    menu.addItem('正常', undefined, () => {
      graph.zoomActual();
    });
    if (graph.enabled) {
      menu.addItem(state.isSelectMouse.value ? '箭头工具' : '选中工具', undefined, () => {
        state.isSelectMouse.value = !state.isSelectMouse.value;
      });
      menu.addItem('全选', undefined, () => {
        graph.selectAll(graph.getDefaultParent());
      });
    }
  };
};
