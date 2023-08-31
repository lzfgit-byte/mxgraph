import type { mxCell } from 'mxgraph';
import { h, render } from 'vue';
import type MyGraph from '@/hook/useGraphGraph';
import mx from '@/hook/useGraphFactory';
import GraphTool from '@/components/GraphTool.vue';
const { mxEvent, mxConstants, mxEventObject } = mx;

const clearCellTools = (classId) => {
  Array.from(document.getElementsByClassName(classId)).forEach((elem) => {
    elem?.parentNode?.removeChild(elem);
  });
};

const setIcon = (graph: MyGraph) => {
  const cells = graph.getAllCells();
  if (cells.length === 0) {
    clearCellTools(mxConstants.CUSTOM_TOOLTIP_STATIC_CLASS);
  }
  cells.forEach((cell: mxCell) => {
    const tooltip = cell.getCustomData(mxConstants.CUSTOM_TOOLTIP);
    const jump = cell.getCustomData(mxConstants.CUSTOM_NODESET_JUMP);
    const geometry = cell.getGeometry();
    const classId = cell.id;
    const iconSize = Math.min(Math.max(20, Math.min(geometry.width, geometry.height) * 0.2), 40);
    const translate = graph?.view?.translate;
    const scale = graph?.view?.scale;
    clearCellTools(classId);
    let count = 0;
    if (tooltip) {
      count++;
    }
    // showJump 默认展示
    let showJump = false;
    if (jump) {
      count++;
      showJump = true;
    }

    if (count > 0) {
      const div = document.createElement('div');
      const vNode = h(GraphTool, {
        content: tooltip,
        showJump,
        width: iconSize,
        height: iconSize,
        popperClass: classId,
        onJumpClick: () => {
          graph.fireEvent(new mxEventObject(mxEvent.CUSTOM_NODESET_JUMP_CLICK), cell);
        },
      });
      render(vNode, div);
      div.style.position = 'absolute';
      div.className = `${cell.id} ${mxConstants.CUSTOM_TOOLTIP_STATIC_CLASS}`;
      div.style.cursor = 'pointer';
      div.style.width = 'auto';
      div.style.height = `${iconSize + 1}px`;
      let left = (geometry.x + geometry.width + translate.x) * scale;
      let top = (geometry.y + translate.y) * scale;
      div.style.left = `${left - 5 - iconSize * count}px`;
      div.style.top = `${top + 5}px`;
      graph.container.appendChild(div);
    }
  });
};

export default (graph: MyGraph) => {
  graph.getModel().addListener(mxEvent.CHANGE, () => {
    setIcon(graph);
  });
  graph.addListener(mxEvent.CUSTOM_NODESET_TOOLTIP, () => {
    setIcon(graph);
  });
  graph.addListener(mxEvent.CUSTOM_CLEAR_ALL_ICON, () => {
    clearCellTools(mxConstants.CUSTOM_TOOLTIP_STATIC_CLASS);
  });
  graph.addListener(mxEvent.PAN_END, () => {
    setIcon(graph);
  });
  graph.view.addListener(mxEvent.SCALE, function () {
    setIcon(graph);
  });
  graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, function () {
    setIcon(graph);
  });
  graph.addListener(mxEvent.REMOVE_CELLS, (name, sender: typeof mxEventObject.prototype) => {
    const props: any = sender.getProperties();
    const cells: mxCell[] = props?.cells;
    cells.forEach((cell) => {
      clearCellTools(cell.id);
    });
  });
};
// ----------
// function CustomMxIconSet(state: mxCellState) {
//   this.images = [];
//   let graph = state.view.graph;
//   const cell = state.cell;
//   const tooltip = cell.getCustomData(mxConstants.CUSTOM_TOOLTIP);
//   if (tooltip) {
//     const div = document.createElement('div');
//     const vNode = h(GraphToolTip, { content: tooltip });
//     render(vNode, div);
//
//     div.style.position = 'absolute';
//     div.style.cursor = 'pointer';
//     div.style.width = '16px';
//     div.style.height = '16px';
//     div.style.left = `${state.x + state.width - 15}px`;
//     div.style.top = `${state.y - 2}px`;
//     state.view.graph.container.appendChild(div);
//     this.images.push(div);
//   }
// }
//
// CustomMxIconSet.prototype.destroy = function () {
//   if (this.images != null) {
//     for (let i = 0; i < this.images.length; i++) {
//       let img = this.images[i];
//       img?.parentNode?.removeChild(img);
//     }
//   }
//   Array.from(document.getElementsByClassName('mxCell-tooltip')).forEach((elem) => {
//     elem?.parentNode?.removeChild(elem);
//   });
//
//   this.images = null;
// };
// overlay---------------------------------------
// let overlay = new mxCellOverlay(
//   new mxImage(
//     'data:image/jpeg;base64,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',
//     10,
//     10
//   ),
//   `<font color=red>${tooltip}</font>`,
//   mxConstants.ALIGN_RIGHT,
//   mxConstants.ALIGN_TOP,
//   new mxPoint(-10, 10)
// );
// overlay.cursor = 'hand';
// overlay.addListener(mxEvent.CLICK, function (sender, evt2) {
//   console.log(sender);
//   console.log(evt2);
// });
// graph.addCellOverlay(cell, overlay);
// ----------
// graph.addMouseListener({
//   currentState: null,
//   currentIconSet: null,
//   mouseDown(sender, me) {
//     // Hides icons on mouse down
//     if (this.currentState != null) {
//       this.dragLeave(me.getEvent(), this.currentState);
//       this.currentState = null;
//     }
//   },
//   mouseMove(sender, me) {
//     if (
//       this.currentState != null &&
//       (me.getState() === this.currentState || me.getState() == null)
//     ) {
//       let tol = 20;
//       const tmp = new mxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol);
//
//       if (mxUtils.intersects(tmp, this.currentState)) {
//         return;
//       }
//     }
//
//     let tmp = graph.view.getState(me.getCell());
//
//     // Ignores everything but vertices
//     if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp.cell))) {
//       tmp = null;
//     }
//
//     if (tmp !== this.currentState) {
//       if (this.currentState != null) {
//         this.dragLeave(me.getEvent(), this.currentState);
//       }
//
//       this.currentState = tmp;
//
//       if (this.currentState != null) {
//         this.dragEnter(me.getEvent(), this.currentState);
//       }
//     }
//   },
//   mouseUp(sender, me) {},
//   dragEnter(evt, state) {
//     if (this.currentIconSet == null) {
//       this.currentIconSet = new CustomMxIconSet(state as any);
//     }
//   },
//   dragLeave(evt, state) {
//     if (this.currentIconSet != null) {
//       this.currentIconSet.destroy();
//       this.currentIconSet = null;
//     }
//   },
// });
