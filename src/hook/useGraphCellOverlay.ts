import type { mxCell } from 'mxgraph';
import type MyGraph from '@/hook/useGraphGraph';
import mx from '@/hook/useGraphFactory';
import { imageFlow } from '@/const/images';
const { mxEvent, mxConstants, mxCellOverlay, mxImage, mxPoint } = mx;

const setOverlay = (graph: MyGraph) => {
  const cells = graph.getAllCells();
  cells.forEach((cell: mxCell) => {
    const cState = graph.view.getCellStates([cell]);
    if (cState.length === 1 && cState[0].overlays) {
      return;
    }
    const overlyIcon = cell.getCustomData(mxConstants.CUSTOM_OVERLY_ICON);
    const geometry = cell.getGeometry();
    const iconSize = Math.min(Math.max(30, Math.max(geometry.width, geometry.height) * 0.3), 60);
    let count = 0;
    if (overlyIcon) {
      count++;
    }
    if (count > 0) {
      let overlay = new mxCellOverlay(
        new mxImage(imageFlow[overlyIcon], iconSize, iconSize),
        ``,
        mxConstants.ALIGN_LEFT,
        mxConstants.ALIGN_MIDDLE,
        new mxPoint(iconSize * 0.5 + 5, 0)
      );
      overlay.cursor = 'hand';
      overlay.addListener(mxEvent.CLICK, function (sender, evt2) {
        console.log(sender);
        console.log(evt2);
      });
      graph.addCellOverlay(cell, overlay);
      graph.refresh();
    }
  });
};

export default (graph: MyGraph) => {
  graph.getModel().addListener(mxEvent.CHANGE, () => {
    setOverlay(graph);
  });
  graph.addListener(mxEvent.CUSTOM_NODESET_TOOLTIP, () => {
    setOverlay(graph);
  });
  graph.addListener(mxEvent.PAN_END, () => {
    setOverlay(graph);
  });
  graph.view.addListener(mxEvent.SCALE, function () {
    setOverlay(graph);
  });
  graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, function () {
    setOverlay(graph);
  });
};
