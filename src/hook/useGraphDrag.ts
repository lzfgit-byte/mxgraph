import { ref } from 'vue';
import type { mxCell as TypeMxCell } from 'mxgraph';
import { nanoid } from 'nanoid';
import mx from './useGraphFactory';
import type { cShapeType } from '@/hook/useGraphSideBarSvg';
import useGraphSideBarSvg from '@/hook/useGraphSideBarSvg';
import type MyGraph from '@/hook/useGraphGraph';
const { mxUtils, mxCell, mxGeometry, mxPoint, mxConstants } = mx;

const baseSvg = ref<cShapeType[]>();
const baseEdgeSvg = ref<cShapeType[]>();

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
    const svgs = [...baseSvg.value, ...baseEdgeSvg.value];
    const drags = svgs.findIndex((item) => item.key === currentDrag.value);
    if (drags > -1) {
      const cCell = svgs[drags];
      if (!cCell.type || cCell.type === 'vertex') {
        const cell = _graph.insertVertetByConfig({
          style: cCell.style,
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
        cell.geometry.setTerminalPoint(new mxPoint(x / 2, y), true);
        cell.geometry.setTerminalPoint(new mxPoint(x * 1.5, y), false);
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
    const { baseShape, baseEdgeShape } = useGraphSideBarSvg(props.graph);
    baseSvg.value = baseShape;
    baseEdgeSvg.value = baseEdgeShape;
    setTimeout(() => {
      const doms = document.querySelectorAll('.side-bar-element');
      doms.forEach((ele: HTMLDivElement) => {
        const dragElt = document.createElement('div');
        dragElt.style.width = `${ele.dataset.w || 100}px`;
        dragElt.style.height = `${ele.dataset.h || 100}px`;
        dragElt.style.border = '1px dashed #000';
        const d = mxUtils.makeDraggable(
          ele as HTMLElement,
          props.graph as MyGraph,
          dropSuccessCb,
          dragElt,
          undefined,
          undefined,
          undefined,
          true
        );
        d.setEnabled(true);
      });
    }, 200);
  };

  return { handlerClick, baseSvg, baseEdgeSvg, initDrag };
};
