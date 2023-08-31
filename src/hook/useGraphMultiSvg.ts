import { ref } from 'vue';
import type { mxCell as TypeMxCell } from 'mxgraph';
import { nanoid } from 'nanoid';
import mx from './useGraphFactory';
import type { cShapeType } from '@/components/mxGraph/src/hook/useGraphSideBarSvg';
import { renderSvgCurrent } from '@/components/mxGraph/src/hook/useGraphSideBarSvg';
import type MyGraph from '@/components/mxGraph/src/hook/useGraphGraph';
import { multiFlowShape, multiShapes } from '@/components/mxGraph/src/const/svgConst';
const { mxUtils, mxCell, mxGeometry, mxPoint, mxConstants } = mx;
const vertexShapeSvg = ref<cShapeType[]>([]);
const edgeShapeSvg = ref<cShapeType[]>([]);
const flowShapeSvg = ref<cShapeType[]>([]);
export default (props: { graph: MyGraph }) => {
  const currentDrag = ref('block');
  const handlerClick = (evt) => {
    currentDrag.value = evt;
  };

  const dropSuccessCb = function (
    _graph: MyGraph,
    evt: any,
    target: TypeMxCell,
    x: number,
    y: number
  ) {
    const svgs = [...vertexShapeSvg.value, ...edgeShapeSvg.value, ...flowShapeSvg.value];
    const drags = svgs.findIndex((item) => item.key === currentDrag.value);
    if (drags > -1) {
      const cCell = svgs[drags];
      if (!cCell.type || cCell.type === 'vertex') {
        const cell = _graph.insertVertetByConfig({
          style: `${cCell.style}`,
          x,
          y,
          width: cCell.tw || cCell.w || 120,
          height: cCell.th || cCell.h || 80,
          type: cCell.type || 'vertex',
          value: cCell.value,
        });
        cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, cCell.key || cCell.style);
      } else if (cCell.type === 'edge') {
        const cell = new mxCell(
          cCell.value,
          new mxGeometry(x, y, cCell.tw || cCell.w, cCell.th || cCell.h),
          cCell.style
        );
        cell.geometry.setTerminalPoint(new mxPoint(x / 2, y + x / 2), true);
        cell.geometry.setTerminalPoint(new mxPoint(x * 1.5, y - x / 2), false);
        cell.geometry.relative = true;
        cell.edge = true;
        cell.id = nanoid();
        cell.setCustomData(mxConstants.CUSTOM_CELL_UNIQUE_KEY, cCell.key || cCell.style);
        _graph.addCells([cell]);
      } else if (cCell.type === 'function') {
        cCell.func(_graph, x, y, cCell.tw || cCell.w, cCell.th || cCell.h);
      }
    }
  };
  const initDrag = () => {
    const { vertexShape, edgeShape } = renderSvgCurrent(props.graph, multiShapes);
    const {
      vertexShape: flowVertex,
      edgeShape: flowEdge,
      funcShapes,
    } = renderSvgCurrent(props.graph, multiFlowShape);
    vertexShapeSvg.value = vertexShape;
    edgeShapeSvg.value = edgeShape;
    flowShapeSvg.value = [...flowVertex, ...flowEdge, ...funcShapes];
    setTimeout(() => {
      const doms = document.querySelectorAll('.side-bar-element');
      doms.forEach((ele: HTMLDivElement) => {
        const dragElt = document.createElement('div');
        dragElt.style.width = `${ele.dataset.w || 100}px`;
        dragElt.style.height = `${ele.dataset.h || 100}px`;
        dragElt.style.border = '1px dashed #000';
        dragElt.style.zIndex = '99999999999999';
        const d = mxUtils.makeDraggable(
          ele as HTMLElement,
          props.graph as MyGraph,
          dropSuccessCb,
          dragElt,
          null,
          null,
          null,
          false
        );
        d.setEnabled(true);
      });
    }, 200);
  };

  return { handlerClick, edgeShapeSvg, vertexShapeSvg, flowShapeSvg, initDrag };
};
